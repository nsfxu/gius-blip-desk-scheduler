Validar:
- Se não existir nenhuma equipe
- Se a extensão estiver no roteador
- Se a API de busca de times falhar por algum motivo

Obs:
- Só puxa as filas que tiver pelo menos um atendente atrelado

Ideias:
- Se a extensão estiver no roteador:
    * Pede para o usuário colocar a chave do bot de atendimento humano
    * A extensão salva essa chave no recursos e usa ela para puxar os dados :galaxybrain:
- Usar toasts para indicar sucesso ou falha

Erros:
- Se você deletar os feriados rapidamente, o plugin cria duplicadas
    * isso está afetando a pesquisa de workTime por algum motivo.
