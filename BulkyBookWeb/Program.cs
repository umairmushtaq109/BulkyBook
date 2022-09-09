using BulkyBook.DataAccess;
using BulkyBook.DataAccess.Repository;
using BulkyBook.DataAccess.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using BulkyBook.Utility;
using Stripe;
using BulkyBook.DataAccess.DbInitializer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add service to connect to SQL Server Database
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Added Automatically by EntityFramework
// builder.Services.AddDefaultIdentity<IdentityUser>() (This Line was: Before Role Management)
builder.Services.AddIdentity<IdentityUser, IdentityRole>().AddDefaultTokenProviders()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Adding Our IEmailSender Service
builder.Services.AddSingleton<IEmailSender, EmailSender>();

// Injecting our Repository Wrapper in Application
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Injecting our DbInitializer in Application
builder.Services.AddScoped<IDbInitializer, DbInitializer>();

// For Razor Pages
builder.Services.AddRazorPages();

// Adding for default pages redirection
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = $"/Identity/Account/Login";
    options.LogoutPath = $"/Identity/Account/Logout";
    options.AccessDeniedPath = $"/Identity/Account/AccessDenied";
});

//Stripe Payment Configuration
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));

//Adding For Sessions
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(100);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

//Adding Facebook Authentication Service
builder.Services.AddAuthentication().AddFacebook(options =>
{
    options.AppId = "602799428218891";
    options.AppSecret = "7e2858919c5007abdb6e4832be3f22ee";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

//Adding Stripe Configuration at Global Level Pipeline (Stripe.NET Nugget Package)
StripeConfiguration.ApiKey = builder.Configuration.GetSection("Stripe:SecretKey").Get<String>();

//Calling SeedDatabase to Initialize Database
SeedDatabase();

// Authentication should always come before authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

// Added because MVC does not work with Razor Pages
app.MapRazorPages();

app.MapControllerRoute(
    name: "default",
    pattern: "{area=Customer}/{controller=Home}/{action=Index}/{id?}");

app.Run();


void SeedDatabase()
{
    using (var scope = app.Services.CreateScope())
    {
        var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
        dbInitializer.Initialize();
    }
}