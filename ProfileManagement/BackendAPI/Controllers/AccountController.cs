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

                await _userManager.AddToRolesAsync(user, userDTO.Roles);

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

                return Accepted(new { Token = await _authManager.CreateToken() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong in the {nameof(Login)}");
                return Problem($"Something went wrong in the {nameof(Login)}", statusCode: 500);
            }
        }


        [HttpPost]
        [Route("Upload")]
        public async Task<ActionResult> UploadImage(List<FormFile> files)
        {

            _logger.LogInformation($"Upload image attempt!");
            try
            {
                long size = files.Sum(s => s.Length);

                if (files != null && size > 0)
                {
                    string imagePath = @"\Upload\Images\";
                    var uploadPath = _environment.WebRootPath + imagePath;

                    if (!Directory.Exists(uploadPath))
                    {
                        Directory.CreateDirectory(uploadPath);
                    }

                    foreach (var file in files)
                    {
                        _logger.LogInformation($"Saving image attempt for {file.FileName}");
                        var filePath = Path.Combine(uploadPath, file.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            var image = _mapper.Map<Image>(files);

                            await file.CopyToAsync(stream);
                            _context.Images.Add(image);
                            await _context.SaveChangesAsync();
                        }
                    }
                    return Ok(new { count = files.Count, size });

                }
                else
                {
                    _logger.LogInformation($"Internal server error: Something went wrong in the {nameof(UploadImage)}");
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong in the {nameof(UploadImage)}");
                return Problem($"Something went wrong in the {nameof(UploadImage)}", statusCode: 500);
            }

        }

        [HttpPost]
        [Route("Download/{id}")]
        public async Task<ActionResult> Download(int id)
        {
            var provider = new FileExtensionContentTypeProvider();

            var image = await _context.Images.FindAsync(id);

            if (image == null)
                return NotFound();

            var file = Path.Combine(_environment.ContentRootPath, @"\Upload\Images\");
            
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
