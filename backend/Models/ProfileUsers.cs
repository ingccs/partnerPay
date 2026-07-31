using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("profiles")]
    public class ProfileUser
    {
        [Key]
        [Column("idperfil")]
        public int IdPerfil { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("perfil")]
        public string Perfil { get; set; } = string.Empty;
    }
}