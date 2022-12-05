using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.Models;
using ProfileManagement.DTOs;
using ProfileManagement.Services;
using ProfileManagement.Data;
using System.IO;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using System.Drawing;
using OfficeOpenXml;
using Excel = Microsoft.Office.Interop.Excel;

namespace ProfileManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;
        private readonly IAuthManager _authManager;
        private readonly IWebHostEnvironment _environment;
        private readonly ProfileManagementContext _context;

        public AccountController(UserManager<User> userManager, ILogger<AccountController> logger, IMapper mapper, IAuthManager authManager,
            IWebHostEnvironment environment, ProfileManagementContext context)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
            _authManager = authManager;
            _environment = environment;
            _context = context;
        }

        [HttpPost]
        [Route("register")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] UserDTO userDTO)
        {
            _logger.LogInformation($"Registration attempt for {userDTO.Email}");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = _mapper.Map<User>(userDTO);
                user.UserName = userDTO.Email;
                var result = await _userManager.CreateAsync(user, userDTO.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return BadRequest(ModelState);
                }
                List<string> list = new List<string>();
                foreach (var role in userDTO.Roles)
                {
                    list.Add(role);
                }

                await _userManager.AddToRolesAsync(user, list);

                return Accepted(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong in the {nameof(Register)}");
                return StatusCode(500, "internal Server Error. Please Contact Your Administrator.");
            }
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDTO userDTO)
        {
            _logger.LogInformation($"Login attempt for {userDTO.Email}");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (!await _authManager.ValidateUser(userDTO))
                {
                    return Unauthorized();
                }

                var user = await _userManager.FindByEmailAsync(userDTO.Email);
                var roles = await _userManager.GetRolesAsync(user);

                return Accepted(new { jwtToken = await _authManager.CreateToken(), roles = roles, id = user.Id }); //, id = user.Id 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong in the {nameof(Login)}");
                return Problem($"Something went wrong in the {nameof(Login)}", statusCode: 500);
            }
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await GetAllUser();
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var entry = await _context.Users.FindAsync(id);

            if (entry == null)
            {
                return NotFound();
            }

            return entry;
        }

        // PUT: api/users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            //user.ModifiedDate = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var entry = await _context.Users.FindAsync(id);
            if (entry == null)
            {
                return NotFound();
            }

            _context.Users.Remove(entry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntryExists(string email)
        {
            return (_context.Users?.Any(e => e.Email == email)).GetValueOrDefault();
        }


        private async Task<IActionResult> GetFile([FromRoute] string fileName)
        {
            string path = _environment.WebRootPath + @"\Upload\Images\";


            if (System.IO.File.Exists(path + fileName + ".png"))
            {
                byte[] b = System.IO.File.ReadAllBytes(path + fileName + ".png");
                return File(b, "image/png");
            }
            else if (System.IO.File.Exists(path + fileName + ".jpg"))
            {
                byte[] b = System.IO.File.ReadAllBytes(path + fileName + ".jpg");
                return File(b, "image/jpg");
            }
            else
            {
                return NotFound();
            }
        }


        [HttpPost("upload"), DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString().Trim();
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("exportToExcel")]
        public ActionResult<IFormFile> ExportToExcel()
        {
            var users = _context.Users.ToList();
            try
            {
                if (users == null)
                    return NotFound();

                var stream = new MemoryStream();

                using (var xlPackage = new ExcelPackage(stream))
                {
                    var worksheet = xlPackage.Workbook.Worksheets.Add("Users");

                    var customStyle = xlPackage.Workbook.Styles.CreateNamedStyle("CustomStyle");
                    customStyle.Style.Font.UnderLine = true;
                    customStyle.Style.Font.Size = 14;
                    customStyle.Style.Font.Bold = true;
                    customStyle.Style.Font.Color.SetColor(Color.Green);

                    var startRow = 5;
                    var row = startRow;

                    worksheet.Cells["A1"].Value = "User Management Profiles";
                    using (var rw = worksheet.Cells["A1:D1"])
                    {
                        rw.Merge = true;
                        rw.Style.Font.Color.SetColor(Color.Black);
                        rw.Style.Font.Size = 14;
                        rw.Style.Font.Bold = true;
                        rw.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        rw.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(180, 234, 17));
                    }

                    worksheet.Cells["A4"].Value = "First Name";
                    worksheet.Cells["B4"].Value = "Last Name";
                    worksheet.Cells["C4"].Value = "Email";
                    worksheet.Cells["D4"].Value = "Status";
                    worksheet.Cells["A4:D4"].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells["A4:D4"].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(180, 234, 17));

                    row = 5;
                    foreach (var user in users)
                    {
                        worksheet.Cells[row, 1].Value = user.FirstName;
                        worksheet.Cells[row, 2].Value = user.LastName;
                        worksheet.Cells[row, 3].Value = user.Email;
                        worksheet.Cells[row, 4].Value = user.Status;

                        row++;
                    }

                    xlPackage.Workbook.Properties.Title = "User Management List";
                    xlPackage.Workbook.Properties.Author = "Kagiso Leso";

                    xlPackage.Save();
                }

                stream.Position = 0;
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "User-Management-List");
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost("batchUpload")]
        public async Task<IActionResult> BatchUpload(IFormFile batchUser)
        {
            if (ModelState.IsValid)
            {
                if(batchUser?.Length > 0)
                {
                    var stream = batchUser.OpenReadStream();

                    List<User> users = new List<User>();

                    try
                    {
                        using (var xlPackage = new ExcelPackage(stream))
                        {
                            var worksheet = xlPackage.Workbook.Worksheets.First();
                            var rowCount = worksheet.Dimension.Rows;

                            for (var row = 2; row <= rowCount; row++)
                            {
                                try
                                {
                                    var firstName = worksheet.Cells[row, 1].Value?.ToString();
                                    var lastName = worksheet.Cells[row, 2].Value?.ToString();
                                    var email = worksheet.Cells[row, 3].Value?.ToString();
                                    var status = worksheet.Cells[row, 4].Value?.ToString();

                                    var user = new User()
                                    {
                                        FirstName = firstName,
                                        LastName = lastName,
                                        Email = email,
                                        Status = status
                                    };

                                    users.Add(user);
                                }
                                catch (Exception ex)
                                {

                                    Console.WriteLine(ex.Message);
                                }
                            }
                        }
                        return Ok(users);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            return NotFound();
        }

        private async Task<List<User>> GetAllUser()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
