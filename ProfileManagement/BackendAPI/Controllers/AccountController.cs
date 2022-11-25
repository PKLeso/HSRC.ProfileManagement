﻿using AutoMapper;
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

                return Accepted();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong in the {nameof(Register)}");
                return StatusCode(500, "internal Server Error. Please Contact Your Administrator.");
                // Another way below
                //return Problem($"Something went wrong in the {nameof(Register)}", statusCode: 500);
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
            return await _context.Users.ToListAsync();
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
        [HttpPut("{email}")]
        public async Task<IActionResult> PutUser(string email, User user)
        {
            if (email != user.Email)
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
                if (!EntryExists(email))
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
        public async Task<IActionResult> DeleteUser(int id)
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


        [HttpPost]
        [Route("upload-image")]
        public async Task<string> UploadImage(IFormFile file)
        {
            try
            {
                if (file != null && file.Length > 0)
                {
                    string imagePath = @"\Upload\Images\";
                    var uploadPath = _environment.WebRootPath + imagePath;

                    if (!Directory.Exists(uploadPath))
                    {
                        Directory.CreateDirectory(uploadPath);
                    }

                    using (FileStream fileStream = System.IO.File.Create(uploadPath + file.FileName))
                    {
                        var image = new Image
                        {
                            FileName = file.FileName,
                            ContentType = file.ContentType,
                            FileSize = file.Length
                        };

                        await file.CopyToAsync(fileStream);
                        _context.Images.Add(image);
                        await _context.SaveChangesAsync();

                        fileStream.Flush();
                        return imagePath + file.FileName + " Uploaded Successfully!";
                    }
                }
                else
                {
                    return "Failed to upload!";
                }

            }
            catch (Exception ex)
            {

                return ex.Message.ToString();
            }
        }


        [HttpPost]
        [Route("download/{id}")]
        public async Task<ActionResult> Download(int id)
        {
            var provider = new FileExtensionContentTypeProvider();

            var image = await _context.Images.FindAsync(id);

            if (image == null)
                return NotFound();

            string imagePath = @"\Upload\Images\";
            var file = Path.Combine(_environment.ContentRootPath, _environment.WebRootPath + image.FileName);

            string contentType;
            if (!provider.TryGetContentType(file, out contentType))
            {
                contentType = "application/octet-stream";
            }

            byte[] fileBytes;
            if (System.IO.File.Exists(file))
            {
                fileBytes = System.IO.File.ReadAllBytes(file);
            }
            else
            {
                return NotFound();
            }

            return File(fileBytes, contentType, image.FileName);
        }

    }
}
