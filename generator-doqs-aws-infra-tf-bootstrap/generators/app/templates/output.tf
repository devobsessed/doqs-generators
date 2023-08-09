output "sample-provider-file" {
  description = "This is a sample provider.tf file to be used by the rest of your infra."

  value       = <<EOT

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.10.0"
    }
  }
  backend "s3" {
    bucket         = "${ module.bootstrap.state_bucket }"
    key            = "${ var.company }/doqs-aws-infra-bootstrap/tfstate"
    region         = "${ var.region }"
    dynamodb_table = "${ module.bootstrap.dynamodb_table }"
    encrypt        = true
  }
}

provider "aws" {
  region = "$${ var.region }"
}

EOT

}
