using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("iduser")]
        public int IdUser { get; set; }

        [MaxLength(30)]
        [Column("user_name")]
        public string? UserName { get; set; } 

        [Column("user")]
        public string? UserLogin { get; set; } 

        [Column("clave")]
        public string? Clave { get; set; } 

        [Column("idperfil")]
        public int? IdPerfil { get; set; } 

        [Column("cedula")]
        public int? Cedula { get; set; } 

        [Column("idestatus")]
        public int? IdEstatus { get; set; } 

        [Column("token")]
        public string? Token { get; set; } 
    }
}