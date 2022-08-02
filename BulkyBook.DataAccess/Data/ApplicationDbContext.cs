using BulkyBook.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BulkyBook.DataAccess
{
    //public class ApplicationDbContext : DbContext (Before Adding Identity)
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Category> tbl_categories { get; set; }
        public DbSet<CoverType> tbl_coverType { get; set; }
        public DbSet<Product> tbl_products { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Company> tbl_company { get; set; }
    }

}
