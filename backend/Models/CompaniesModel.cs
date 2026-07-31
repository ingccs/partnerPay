using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("companies")]
    public class Company
    {
        [Key]
        [Column("idcmpy")]
        public int IdCmpy { get; set; }

        [Required]
        [MaxLength(1)]
        [Column("typ")]
        public string Typ { get; set; } = string.Empty;

        [Required]
        [MaxLength(9)]
        [Column("ci")]
        public string Ci { get; set; } = string.Empty;

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("mobile")]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [Column("cestado")]
        public int CEstado { get; set; }

        [Required]
        [Column("xcity")]
        public string XCity { get; set; } = string.Empty;

        [Required]
        [Column("xdir")]
        public string XDir { get; set; } = string.Empty;

        [Required]
        [Column("idestatus")]
        public int IdEstatus { get; set; }
    }
}