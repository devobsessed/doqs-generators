

module "bootstrap" {
  source  = "trussworks/bootstrap/aws"
  version = "5.1.0"

  region        = var.region
  account_alias = "${var.company}-${var.env}"

}
