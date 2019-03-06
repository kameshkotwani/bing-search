//Constant Strings
const CFG_SECTION = "bingSearch";
const CFG_QUERY = "QueryTemplate";
const CMD_ID = "extension.bingSearch";

const vscode = require("vscode");

function activate(context) {
  //Activating Function
  const disposable = vscode.commands.registerTextEditorCommand(
    CMD_ID,
    webSearch
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

//Empty Deactivate Function
function deactivate() {}
exports.deactivate = deactivate;

//Function to launch the Search URL in default browser
function webSearch() {
  var selectedText = GetSelectedText();
  if (!selectedText) {
    return;
  }
  let uriText = encodeURI(selectedText);
  let bingSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = bingSearchCfg.get(CFG_QUERY);
  let query = queryTemplate.replace("%SELECTION%", uriText);
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
}

//GetSelectedText creates a URL for search based on the selection
function GetSelectedText() {
  const documentText = vscode.window.activeTextEditor.document.getText();
  if (!documentText) {
    return "";
  }
  let activeSelection = vscode.window.activeTextEditor.selection;
  if (activeSelection.isEmpty) {
    return "";
  }
  const selStartoffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.start
  );
  const selEndOffset = vscode.window.activeTextEditor.document.offsetAt(
    activeSelection.end
  );

  let selectedText = documentText.slice(selStartoffset, selEndOffset).trim();
  selectedText = selectedText.replace(/\s\s+/g, " ");
  return selectedText;
}
