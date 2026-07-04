---
title: 'Automatically Configure LSPs in Neovim'
description: 'Automate LSP setup in Neovim using Mason'
date: '2024-10-19 19:21'
---

Language Server Protocols (LSPs) are crucial for modern development environments, providing features like auto-completion, go-to-definition, and diagnostics. One drawback of Neovim compared to other editors like VSCode is that you have to set everything up yourself. Well, it's also what makes it so powerful.

The easiest way to setup LSP is by using two plugins: [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim). The first one is used to install and manage LSP servers, DAP servers, linters, and formatters. The second one is a companion extension that helps register installed servers with the necessary configuration.

## Prerequisites

If you have already configured your LSP, you should have two functions ready: `on_attach` and `capabilities`. If you haven't set it up yet, here is an example that includes setting up diagnostics:

```lua
vim.lsp.handlers['textDocument/hover'] = vim.lsp.with(vim.lsp.handlers.hover, {
    border = 'rounded',
})

vim.lsp.handlers['textDocument/publishDiagnostics'] =
    vim.lsp.with(vim.lsp.diagnostic.on_publish_diagnostics, {
        underline = true,
        update_in_insert = false,
        virtual_text = { spacing = 4 },
        severity_sort = true,
    })

vim.diagnostic.config({
    update_in_insert = true,
    float = {
        source = true,
    },
})


local augroup = vim.api.nvim_create_augroup('Format', { clear = true })

local on_attach = function(client, bufnr)
    if client.supports_method('textDocument/formatting') then
        vim.api.nvim_clear_autocmds({ group = augroup, buffer = bufnr })
        vim.api.nvim_create_autocmd('BufWritePre', {
            group = augroup,
            buffer = bufnr,
            callback = function() vim.lsp.buf.format({ bufnr = bufnr }) end,
        })
    end
end

-- Set up completion using nvim_cmp with LSP source
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities = require('cmp_nvim_lsp').default_capabilities(capabilities)
```

## Bare minimum

**One thing before we begin the setup**: you must configure your plugins in the following order: `mason.nvim`, `mason-lspconfig`, and then set up servers using `lspconfig`.

I have the `on_attach` and `capabilities` functions defined in a separate file, so I need to import them. However, you can include them in the same file. This is the bare minimum to make it work:

```lua
local mason = require('mason')
local lspconfig = require('mason-lspconfig')
local nvim_lsp = require('lspconfig')

local on_attach = require('config.shared').on_attach
local capabilities = require('config.shared').capabilities

-- Initialize Mason
mason.setup({})

-- Configure Mason to automatically install LSP servers
lspconfig.setup({
    automatic_installation = true,
})

-- Let Mason handle installed LSP configuration
lspconfig.setup_handlers({
    function(server_name)
        on_attach = on_attach,
		capabilities = capabilities,
    end,
})
```

Now you can install LSPs with Mason and have them configured automatically. For example, running `:LSPInstall` in a Go file will suggest installing LSPs specifically for Go.

```text
Please select which server you want to install for filetype "go":
1: ast_grep
2: golangci_lint_ls
3: gopls (installed)
4: harper_ls
5: snyk_ls
Type number and <Enter> or click with the mouse (q or empty cancels):
```

## More granular configuration

Sometimes, you may want to configure the LSP with specific settings. For instance, you might want to set up `lua_ls` to recognize the `vim` global or to disable formatting. You may also wish to disable `pyright` diagnostics and use it solely for completion. Let’s look at an example of this setup. First, define two tables: `settings` and `handlers`:

```lua
local settings = {
  lua_ls = {
      Lua = {
          runtime = {
              version = 'LuaJIT',
          },
          diagnostics = {
              globals = { 'vim' },
          },
          format = {
              enable = false,
          },
          workspace = {
              library = vim.api.nvim_get_runtime_file('', true),
              checkThirdParty = false,
          },
      },
  },
  pyright = {
      typeCheckingMode = 'off',
      python = {
          analysis = {
              typeCheckingMode = 'off',
          },
      },
      pyright = {
          disableDiagnostics = true,
      },
  },
}

local handlers =  {
  pyright = {
      ['textDocument/publishDiagnostics'] = function(...) end,
  },
}

```

Then you can create a `config` table to store the default configuration along with server-specific settings.

```lua
local config = {
  -- default configuration
  BASE = {
      on_attach = on_attach,
      capabilities = capabilities,
  },
  lua_ls = {
      settings = settings['lua_ls'],
  },
  pyright = {
      settings = settings['pyright'],
      handlers = handlers['pyright'],
  },
}
```

Now, you need to modify the `setup_handlers` function slightly.

```lua
lspconfig.setup_handlers({
    function(server_name)
        local config = configs[server_name] or configs['BASE']
        nvim_lsp[server_name].setup(vim.tbl_extend('force', configs['BASE'], config))
    end,
})
```

This approach allows for flexible and modular LSP configurations. You can easily add or modify settings for specific language servers without affecting the others.
