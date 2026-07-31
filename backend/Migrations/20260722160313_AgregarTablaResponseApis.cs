using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTablaResponseApis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "banks",
                columns: table => new
                {
                    idbco = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cbanco = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                    xbanco = table.Column<string>(type: "text", nullable: false),
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_banks", x => x.idbco);
                });

            migrationBuilder.CreateTable(
                name: "comissions",
                columns: table => new
                {
                    idcomission = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idpoliza = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<int>(type: "integer", nullable: false),
                    idcoverage = table.Column<int>(type: "integer", nullable: true),
                    comission = table.Column<decimal>(type: "numeric(11,2)", nullable: false),
                    date_register = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    enviado = table.Column<int>(type: "integer", nullable: false),
                    date_send = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    pagado = table.Column<int>(type: "integer", nullable: false),
                    date_pay = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ref_pay = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comissions", x => x.idcomission);
                });

            migrationBuilder.CreateTable(
                name: "ecivil",
                columns: table => new
                {
                    idecivil = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ecivil = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    letra = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ecivil", x => x.idecivil);
                });

            migrationBuilder.CreateTable(
                name: "estatus",
                columns: table => new
                {
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    estatus = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estatus", x => x.idestatus);
                });

            migrationBuilder.CreateTable(
                name: "estatus_payment",
                columns: table => new
                {
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    estatus = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estatus_payment", x => x.idestatus);
                });

            migrationBuilder.CreateTable(
                name: "frequency",
                columns: table => new
                {
                    idfrecu = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    frecuencia = table.Column<string>(type: "text", nullable: false),
                    letra = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_frequency", x => x.idfrecu);
                });

            migrationBuilder.CreateTable(
                name: "maciudades",
                columns: table => new
                {
                    idciudad = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cpais = table.Column<int>(type: "integer", nullable: false),
                    cestado = table.Column<int>(type: "integer", nullable: false),
                    cciudad = table.Column<int>(type: "integer", nullable: false),
                    ciu_descripcion_l = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ciu_descripcion_c = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maciudades", x => x.idciudad);
                });

            migrationBuilder.CreateTable(
                name: "maestados",
                columns: table => new
                {
                    idestado = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cpais = table.Column<int>(type: "integer", nullable: false),
                    cestado = table.Column<int>(type: "integer", nullable: false),
                    xdescripcion_l = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    xdescripcion_c = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maestados", x => x.idestado);
                });

            migrationBuilder.CreateTable(
                name: "pagos",
                columns: table => new
                {
                    idpago = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fec_dd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_ht = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    idhijo = table.Column<int>(type: "integer", nullable: false),
                    mnt_pagado = table.Column<int>(type: "integer", nullable: false),
                    frm_pago = table.Column<int>(type: "integer", nullable: false),
                    referencia = table.Column<string>(type: "text", nullable: false),
                    fec_pago = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pagos", x => x.idpago);
                });

            migrationBuilder.CreateTable(
                name: "parentesco",
                columns: table => new
                {
                    idparen = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    parentesco = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parentesco", x => x.idparen);
                });

            migrationBuilder.CreateTable(
                name: "polizas",
                columns: table => new
                {
                    idpoliza = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nro_policy = table.Column<string>(type: "text", nullable: false),
                    nro_receipt = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    cramo_sisip = table.Column<int>(type: "integer", nullable: false),
                    plan = table.Column<string>(type: "text", nullable: false),
                    frequency = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false),
                    date_emission = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_admission = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_dd_policy = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_ht_policy = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_dd_receipt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_ht_receipt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_pay = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    prima = table.Column<decimal>(type: "numeric(11,2)", nullable: false),
                    yearpolicy = table.Column<int>(type: "integer", nullable: false),
                    monthpolicy = table.Column<int>(type: "integer", nullable: false),
                    tasabcv = table.Column<decimal>(type: "numeric(11,2)", nullable: true),
                    idcmpy = table.Column<int>(type: "integer", nullable: false),
                    idproduct = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_polizas", x => x.idpoliza);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    idproduct = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idcmpy = table.Column<int>(type: "integer", nullable: false),
                    idramo = table.Column<int>(type: "integer", nullable: false),
                    cramo_sisip = table.Column<int>(type: "integer", nullable: true),
                    id_producto_sisip = table.Column<int>(type: "integer", nullable: false),
                    cplan_sisip = table.Column<string>(type: "text", nullable: false),
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.idproduct);
                });

            migrationBuilder.CreateTable(
                name: "products_coverage",
                columns: table => new
                {
                    idcoverage = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idproduct = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    percent = table.Column<decimal>(type: "numeric(11,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products_coverage", x => x.idcoverage);
                });

            migrationBuilder.CreateTable(
                name: "products_user",
                columns: table => new
                {
                    idoption = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idseller = table.Column<int>(type: "integer", nullable: false),
                    idproduct = table.Column<int>(type: "integer", nullable: false),
                    permiso = table.Column<int>(type: "integer", nullable: false),
                    comission = table.Column<decimal>(type: "numeric(11,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products_user", x => x.idoption);
                });

            migrationBuilder.CreateTable(
                name: "profiles",
                columns: table => new
                {
                    idperfil = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    perfil = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profiles", x => x.idperfil);
                });

            migrationBuilder.CreateTable(
                name: "ramos",
                columns: table => new
                {
                    idramo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cramo_sisip = table.Column<int>(type: "integer", nullable: true),
                    xramo_sisip = table.Column<string>(type: "text", nullable: false),
                    condicionado = table.Column<byte[]>(type: "bytea", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ramos", x => x.idramo);
                });

            migrationBuilder.CreateTable(
                name: "responseapis",
                columns: table => new
                {
                    idresponse = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idprepoliza = table.Column<int>(type: "integer", nullable: true),
                    respuesta = table.Column<string>(type: "text", nullable: true),
                    jsonn = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_responseapis", x => x.idresponse);
                });

            migrationBuilder.CreateTable(
                name: "seller_coverage_comission",
                columns: table => new
                {
                    idseller = table.Column<int>(type: "integer", nullable: false),
                    idcoverage = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    comission = table.Column<decimal>(type: "numeric(11,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seller_coverage_comission", x => new { x.idseller, x.idcoverage });
                });

            migrationBuilder.CreateTable(
                name: "sellers",
                columns: table => new
                {
                    idseller = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idpapa = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    typ = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false),
                    ci = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    lastname = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    mobile = table.Column<string>(type: "text", nullable: false),
                    comission = table.Column<decimal>(type: "numeric(11,2)", nullable: true),
                    cestado = table.Column<int>(type: "integer", nullable: true),
                    xcity = table.Column<string>(type: "text", nullable: true),
                    xdir = table.Column<string>(type: "text", nullable: true),
                    ecivil = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: true),
                    sexx = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: true),
                    fecha_nac = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    banco = table.Column<string>(type: "text", nullable: true),
                    nrocta = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    pdf_ced = table.Column<byte[]>(type: "bytea", nullable: true),
                    pdf_rif = table.Column<byte[]>(type: "bytea", nullable: true),
                    nivel = table.Column<int>(type: "integer", nullable: true),
                    fpay = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    idestatus = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sellers", x => x.idseller);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    iduser = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_name = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    user = table.Column<string>(type: "text", nullable: true),
                    clave = table.Column<string>(type: "text", nullable: true),
                    idperfil = table.Column<int>(type: "integer", nullable: true),
                    cedula = table.Column<int>(type: "integer", nullable: true),
                    idestatus = table.Column<int>(type: "integer", nullable: true),
                    token = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.iduser);
                });

            migrationBuilder.CreateTable(
                name: "validaciones_email",
                columns: table => new
                {
                    idvalidacion = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    correo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    codigo = table.Column<int>(type: "integer", nullable: false),
                    idestatus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_validaciones_email", x => x.idvalidacion);
                });

            migrationBuilder.InsertData(
                table: "ecivil",
                columns: new[] { "idecivil", "ecivil", "letra" },
                values: new object[,]
                {
                    { 1, "Soltero", "S" },
                    { 2, "Casado", "C" },
                    { 3, "Viudo", "V" },
                    { 4, "Divorciado", "D" }
                });

            migrationBuilder.InsertData(
                table: "estatus",
                columns: new[] { "idestatus", "estatus" },
                values: new object[,]
                {
                    { 1, "Activo" },
                    { 2, "Inactivo" },
                    { 3, "Pendiente" },
                    { 4, "Pagado" }
                });

            migrationBuilder.InsertData(
                table: "estatus_payment",
                columns: new[] { "idestatus", "estatus" },
                values: new object[,]
                {
                    { 1, "Registrado" },
                    { 2, "Pagado" },
                    { 3, "Anulado" }
                });

            migrationBuilder.InsertData(
                table: "frequency",
                columns: new[] { "idfrecu", "frecuencia", "letra" },
                values: new object[,]
                {
                    { 1, "Anual", "A" },
                    { 2, "Semestral", "S" },
                    { 3, "Cuatrimestral", "C" },
                    { 4, "Trimestral", "T" },
                    { 5, "Mensual", "M" }
                });

            migrationBuilder.InsertData(
                table: "maestados",
                columns: new[] { "idestado", "cestado", "cpais", "xdescripcion_c", "xdescripcion_l" },
                values: new object[,]
                {
                    { 1, 1, 58, "Dtto Capital", "Distrito Capital" },
                    { 2, 2, 58, "Amazonas", "Amazonas" },
                    { 3, 3, 58, "Anzoategui", "Anzoategui" },
                    { 4, 4, 58, "Apure", "Apure" },
                    { 5, 5, 58, "Aragua", "Aragua" },
                    { 6, 6, 58, "Barinas", "Barinas" },
                    { 7, 7, 58, "Bolivar", "Bolivar" },
                    { 8, 8, 58, "Carabobo", "Carabobo" },
                    { 9, 9, 58, "Cojedes", "Cojedes" },
                    { 10, 10, 58, "Delta Amacuro", "Delta Amacuro" },
                    { 11, 11, 58, "Falcon", "Falcon" },
                    { 12, 12, 58, "Guarico", "Guarico" },
                    { 13, 13, 58, "Lara", "Lara" },
                    { 14, 14, 58, "Merida", "Merida" },
                    { 15, 15, 58, "Monagas", "Monagas" },
                    { 16, 16, 58, "Nueva Esparta", "Nueva Esparta" },
                    { 17, 17, 58, "Portuguesa", "Portuguesa" },
                    { 18, 18, 58, "Sucre", "Sucre" },
                    { 19, 19, 58, "Tachira", "Tachira" },
                    { 20, 20, 58, "Trujillo", "Trujillo" },
                    { 21, 21, 58, "Yaracuy", "Yaracuy" },
                    { 22, 22, 58, "Zulia", "Zulia" },
                    { 23, 23, 58, "La Guaira", "La Guaira" },
                    { 24, 24, 58, "Miranda", "Miranda" }
                });

            migrationBuilder.InsertData(
                table: "parentesco",
                columns: new[] { "idparen", "idestatus", "parentesco" },
                values: new object[,]
                {
                    { 1, 1, "Titular" },
                    { 2, 1, "Conyuge" },
                    { 3, 1, "Hijo (a)" },
                    { 4, 2, "Abuelos (as)" },
                    { 5, 2, "Tios (as)" },
                    { 6, 1, "Padres" },
                    { 7, 2, "Hermano (a)" },
                    { 8, 1, "Otro" }
                });

            migrationBuilder.InsertData(
                table: "profiles",
                columns: new[] { "idperfil", "perfil" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Seller Master" },
                    { 3, "Seller" }
                });

            migrationBuilder.InsertData(
                table: "ramos",
                columns: new[] { "idramo", "cramo_sisip", "condicionado", "xramo_sisip" },
                values: new object[,]
                {
                    { 1, 5, null, "ACCIDENTES PERSONALES" },
                    { 2, 9, null, "GASTOS FUNERARIOS" },
                    { 3, 0, null, "RCV" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "banks");

            migrationBuilder.DropTable(
                name: "comissions");

            migrationBuilder.DropTable(
                name: "ecivil");

            migrationBuilder.DropTable(
                name: "estatus");

            migrationBuilder.DropTable(
                name: "estatus_payment");

            migrationBuilder.DropTable(
                name: "frequency");

            migrationBuilder.DropTable(
                name: "maciudades");

            migrationBuilder.DropTable(
                name: "maestados");

            migrationBuilder.DropTable(
                name: "pagos");

            migrationBuilder.DropTable(
                name: "parentesco");

            migrationBuilder.DropTable(
                name: "polizas");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "products_coverage");

            migrationBuilder.DropTable(
                name: "products_user");

            migrationBuilder.DropTable(
                name: "profiles");

            migrationBuilder.DropTable(
                name: "ramos");

            migrationBuilder.DropTable(
                name: "responseapis");

            migrationBuilder.DropTable(
                name: "seller_coverage_comission");

            migrationBuilder.DropTable(
                name: "sellers");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "validaciones_email");
        }
    }
}
