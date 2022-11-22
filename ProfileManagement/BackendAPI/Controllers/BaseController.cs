using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.Data;

namespace ProfileManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        public readonly ProfileManagementContext context;
        public IConfiguration configuration;

        public BaseController(ProfileManagementContext ctx, IConfiguration iConfig)
        {
            context = ctx;
            configuration = iConfig;
        }
    }
}
