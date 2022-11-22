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
    [Authorize]//[Authorize(Roles = "Admin")] // Only give access to the Admin role
    [Route("api/[controller]")]
    [ApiController]
    public class EntriesController : BaseController
    {
        public EntriesController(ProfileManagementContext ctx, IConfiguration iConfig) : base(ctx, iConfig)
        {
        }

        // GET: api/entries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entry>>> GetEntries()
        {
          if (context.Entries == null)
          {
              return NotFound();
          }
            return await context.Entries.ToListAsync();
        }

        // GET: api/entries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entry>> GetEntry(int id)
        {
          if (context.Entries == null)
          {
              return NotFound();
          }
            var entry = await context.Entries.FindAsync(id);

            if (entry == null)
            {
                return NotFound();
            }

            return entry;
        }

        // PUT: api/entries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntry(int id, Entry entry)
        {
            if (id != entry.Id)
            {
                return BadRequest();
            }
            entry.ModifiedDate = DateTime.Now;
            context.Entry(entry).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
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

        // POST: api/entries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Entry>> PostEntry(Entry entry)
        {
          if (context.Entries == null)
          {
              return Problem("Entity set 'PhonebookDbContext.Entries'  is null.");
          }
            entry.EntryDate = DateTime.Now;
            context.Entries.Add(entry);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetEntry", new { id = entry.Id }, entry);
        }

        // DELETE: api/entries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            if (context.Entries == null)
            {
                return NotFound();
            }
            var entry = await context.Entries.FindAsync(id);
            if (entry == null)
            {
                return NotFound();
            }

            context.Entries.Remove(entry);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntryExists(int id)
        {
            return (context.Entries?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
