using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace ProfileManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FileUploadController : ControllerBase
    {
        public static IWebHostEnvironment _environment;

        public FileUploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFile([FromRoute] string fileName)
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

        [HttpPost]
        public async Task<string> SaveFile(IFormFile file)
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
                        await file.CopyToAsync(fileStream);
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

    }
}
