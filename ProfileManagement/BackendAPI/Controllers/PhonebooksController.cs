using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProfileManagement.Data;
using ProfileManagement.Models;

namespace ProfileManagement.Controllers
{

    //[Authorize]
     //[Authorize(Roles = "SystemAdmins")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhonebooksController : BaseController
    {
        public PhonebooksController(ProfileManagementContext ctx, IConfiguration iConfig) : base(ctx, iConfig)
        {
        }

        // GET: api/phonebooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Phonebook>>> GetPhonebooks()
        {
          if (context.Phonebooks == null)
          {
              return NotFound();
          }
            return await context.Phonebooks.ToListAsync();
        }

        // GET: api/phonebooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Phonebook>> GetPhonebook(int id)
        {
          if (context.Phonebooks == null)
          {
              return NotFound();
          }
            var phonebook = await context.Phonebooks.FindAsync(id);

            if (phonebook == null)
            {
                return NotFound();
            }

            return phonebook;
        }

        // PUT: api/phonebooks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhonebook(int id, Phonebook phonebook)
        {
            if (id != phonebook.Id)
            {
                return BadRequest();
            }

            context.Entry(phonebook).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhonebookExists(id))
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

        // POST: api/phonebooks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Phonebook>> PostPhonebook(Phonebook phonebook)
        {
          if (context.Phonebooks == null)
          {
              return Problem("Entity set 'PhonebookDbContext.Phonebooks'  is null.");
          }
            context.Phonebooks.Add(phonebook);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetPhonebook", new { id = phonebook.Id }, phonebook);
        }

        // DELETE: api/phonebooks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhonebook(int id)
        {
            if (context.Phonebooks == null)
            {
                return NotFound();
            }
            var phonebook = await context.Phonebooks.FindAsync(id);
            if (phonebook == null)
            {
                return NotFound();
            }

            context.Phonebooks.Remove(phonebook);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool PhonebookExists(int id)
        {
            return (context.Phonebooks?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
