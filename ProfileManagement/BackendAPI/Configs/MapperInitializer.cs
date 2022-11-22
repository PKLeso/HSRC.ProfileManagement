using AutoMapper;
using ProfileManagement.Models;
using ProfileManagement.DTOs;

namespace ProfileManagement.Configs
{
    public class MapperInitializer : Profile
    {
        public MapperInitializer()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<Image, ImageDTO>().ReverseMap();
        }
    }
}
