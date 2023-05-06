{ pkgs }: {
  deps = [
    pkgs.openssh_with_kerberos
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}