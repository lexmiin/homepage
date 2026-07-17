{
  description = "A Nix-flake-based Node.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-26.05";
    flake-utils.url = "github:numtide/flake-utils";
    fnox.url = "github:lexmiin/fnox-nix";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    fnox,
  }:
    {
      overlays.default = final: prev: {
        nodejs = final.nodejs_24;
        pnpm = final.pnpm_11;
      };
    }
    // (flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            self.overlays.default
            fnox.overlays.default
          ];
        };
      in {
        formatter = pkgs.alejandra;

        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs
            pkgs.pnpm
            pkgs.fnox
          ];
        };
      }
    ));
}
