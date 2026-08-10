using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

namespace BackendApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<AllEstatus> AllEstatus { get; set; }
        public DbSet<AllEstatusPay> AllEstatusPay { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Comission> Comissions { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<CuentaPagadora> CuentasPagadoras { get; set; }
        public DbSet<FrecuenciaPago> FrecuenciasPago { get; set; }
        public DbSet<FrequencyTypes> FrequencyTypes { get; set; }
        public DbSet<MaritalStatus> MaritalStatuses { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<Product> Products { get; set; }
        
        public DbSet<ProductCoverage> ProductsCoverage { get; set; }
        public DbSet<ProductUser> ProductsUsers { get; set; }
        public DbSet<ProfileUser> Profiles { get; set; }
        public DbSet<Ramo> Ramos { get; set; }
        public DbSet<Relationship> Relationships { get; set; }
        public DbSet<ApiResponse> ResponseApis { get; set; }
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<SellerCoverageComission> SellerCoverageComissions { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<EmailValidation> ValidacionesEmail { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AllEstatus>().HasData(
                new AllEstatus { IdEstatus = 1, Estatus = "Activo" },
                new AllEstatus { IdEstatus = 2, Estatus = "Inactivo" },
                new AllEstatus { IdEstatus = 3, Estatus = "Pendiente" },
                new AllEstatus { IdEstatus = 4, Estatus = "Pagado" }
            );      
            
            modelBuilder.Entity<AllEstatusPay>().HasData(
                new AllEstatusPay { IdEstatus = 1, Estatus = "Registrado" },
                new AllEstatusPay { IdEstatus = 2, Estatus = "Pagado" },
                new AllEstatusPay { IdEstatus = 3, Estatus = "Anulado" }
            );  

            modelBuilder.Entity<MaritalStatus>().HasData(
                new MaritalStatus { IdEcivil = 1, Ecivil = "Soltero", Letra = "S" },
                new MaritalStatus { IdEcivil = 2, Ecivil = "Casado", Letra = "C" },
                new MaritalStatus { IdEcivil = 3, Ecivil = "Viudo", Letra = "V" },
                new MaritalStatus { IdEcivil = 4, Ecivil = "Divorciado", Letra = "D" }
            );       

            modelBuilder.Entity<FrequencyTypes>().HasData(
                new FrequencyTypes { IdFrecu = 1, Frecuencia = "Anual", Letra = "A" },
                new FrequencyTypes { IdFrecu = 2, Frecuencia = "Semestral", Letra = "S" },
                new FrequencyTypes { IdFrecu = 3, Frecuencia = "Cuatrimestral", Letra = "C" },
                new FrequencyTypes { IdFrecu = 4, Frecuencia = "Trimestral", Letra = "T" },
                new FrequencyTypes { IdFrecu = 5, Frecuencia = "Mensual", Letra = "M" }
            );  

            modelBuilder.Entity<State>().HasData(
                new State { IdEstado = 1, CPais = 58, CEstado = 1, XDescripcionL = "Distrito Capital", XDescripcionC = "Dtto Capital" },
                new State { IdEstado = 2, CPais = 58, CEstado = 2, XDescripcionL = "Amazonas", XDescripcionC = "Amazonas" },
                new State { IdEstado = 3, CPais = 58, CEstado = 3, XDescripcionL = "Anzoategui", XDescripcionC = "Anzoategui" },
                new State { IdEstado = 4, CPais = 58, CEstado = 4, XDescripcionL = "Apure", XDescripcionC = "Apure" },
                new State { IdEstado = 5, CPais = 58, CEstado = 5, XDescripcionL = "Aragua", XDescripcionC = "Aragua" },
                new State { IdEstado = 6, CPais = 58, CEstado = 6, XDescripcionL = "Barinas", XDescripcionC = "Barinas" },
                new State { IdEstado = 7, CPais = 58, CEstado = 7, XDescripcionL = "Bolivar", XDescripcionC = "Bolivar" },
                new State { IdEstado = 8, CPais = 58, CEstado = 8, XDescripcionL = "Carabobo", XDescripcionC = "Carabobo" },
                new State { IdEstado = 9, CPais = 58, CEstado = 9, XDescripcionL = "Cojedes", XDescripcionC = "Cojedes" },
                new State { IdEstado = 10, CPais = 58, CEstado = 10, XDescripcionL = "Delta Amacuro", XDescripcionC = "Delta Amacuro" },
                new State { IdEstado = 11, CPais = 58, CEstado = 11, XDescripcionL = "Falcon", XDescripcionC = "Falcon" },
                new State { IdEstado = 12, CPais = 58, CEstado = 12, XDescripcionL = "Guarico", XDescripcionC = "Guarico" },
                new State { IdEstado = 13, CPais = 58, CEstado = 13, XDescripcionL = "Lara", XDescripcionC = "Lara" },
                new State { IdEstado = 14, CPais = 58, CEstado = 14, XDescripcionL = "Merida", XDescripcionC = "Merida" },
                new State { IdEstado = 15, CPais = 58, CEstado = 15, XDescripcionL = "Monagas", XDescripcionC = "Monagas" },
                new State { IdEstado = 16, CPais = 58, CEstado = 16, XDescripcionL = "Nueva Esparta", XDescripcionC = "Nueva Esparta" },
                new State { IdEstado = 17, CPais = 58, CEstado = 17, XDescripcionL = "Portuguesa", XDescripcionC = "Portuguesa" },
                new State { IdEstado = 18, CPais = 58, CEstado = 18, XDescripcionL = "Sucre", XDescripcionC = "Sucre" },
                new State { IdEstado = 19, CPais = 58, CEstado = 19, XDescripcionL = "Tachira", XDescripcionC = "Tachira" },
                new State { IdEstado = 20, CPais = 58, CEstado = 20, XDescripcionL = "Trujillo", XDescripcionC = "Trujillo" },
                new State { IdEstado = 21, CPais = 58, CEstado = 21, XDescripcionL = "Yaracuy", XDescripcionC = "Yaracuy" },
                new State { IdEstado = 22, CPais = 58, CEstado = 22, XDescripcionL = "Zulia", XDescripcionC = "Zulia" },
                new State { IdEstado = 23, CPais = 58, CEstado = 23, XDescripcionL = "La Guaira", XDescripcionC = "La Guaira" },
                new State { IdEstado = 24, CPais = 58, CEstado = 24, XDescripcionL = "Miranda", XDescripcionC = "Miranda" }
            );

            modelBuilder.Entity<Relationship>().HasData(
                new Relationship { IdParen = 1, ParentescoName = "Titular", IdEstatus = 1 },
                new Relationship { IdParen = 2, ParentescoName = "Conyuge", IdEstatus = 1 },
                new Relationship { IdParen = 3, ParentescoName = "Hijo (a)", IdEstatus = 1 },
                new Relationship { IdParen = 4, ParentescoName = "Abuelos (as)", IdEstatus = 2 },
                new Relationship { IdParen = 5, ParentescoName = "Tios (as)", IdEstatus = 2 },
                new Relationship { IdParen = 6, ParentescoName = "Padres", IdEstatus = 1 },
                new Relationship { IdParen = 7, ParentescoName = "Hermano (a)", IdEstatus = 2 },
                new Relationship { IdParen = 8, ParentescoName = "Otro", IdEstatus = 1 }
            );

            modelBuilder.Entity<Ramo>().HasData(
                new Ramo { IdRamo = 1, CRamoSisip = 5, XRamoSisip = "ACCIDENTES PERSONALES", Condicionado = null },
                new Ramo { IdRamo = 2, CRamoSisip = 9, XRamoSisip = "GASTOS FUNERARIOS", Condicionado = null },
                new Ramo { IdRamo = 3, CRamoSisip = 0, XRamoSisip = "RCV", Condicionado = null }
            );

            modelBuilder.Entity<ProfileUser>().HasData(
                new ProfileUser { IdPerfil = 1, Perfil = "Admin" },
                new ProfileUser { IdPerfil = 2, Perfil = "Seller Master" },
                new ProfileUser { IdPerfil = 3, Perfil = "Seller" }
            );

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Coverages)
                .WithOne(c => c.Product)
                .HasForeignKey(c => c.Idproduct)
                .HasConstraintName("fk_products_coverage");

            modelBuilder.Entity<FrecuenciaPago>().ToTable("frecuencia_pagos");
        }
    }
}