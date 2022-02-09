using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _cotext;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext cotext , ITokenService tokenService)
        {
            _tokenService = tokenService;
            _cotext = cotext;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await this.IsUserExists(registerDto.UserName)) return BadRequest("Username is taken");

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                passwordSalt = hmac.Key
            };

            _cotext.Users.Add(user);
            await _cotext.SaveChangesAsync();

            return new UserDto 
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _cotext.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync( x => x.UserName == loginDto.UserName);
            
            if(user == null) return Unauthorized("Username doesn't exists");

            using var hmac = new HMACSHA512(user.passwordSalt);

            var loginHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < loginHash.Length; i++)
            {
                if(loginHash[i] != user.passwordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto 
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> IsUserExists(string username)
        {
            return await _cotext.Users.AnyAsync( x => x.UserName == username.ToLower());
        }

    }
}