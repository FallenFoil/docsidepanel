import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getFilesFolders(path: string): string[] {
  if(!fs.existsSync(path)){
    return [];
  }
  
  let items: string[] = fs.readdirSync(path, {encoding: 'utf8', withFileTypes: false, recursive: false});
  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  items = items.sort(collator.compare);

  if(items.length === 0){
    vscode.window.showErrorMessage('The selected Documentation folder is empty!');
  }

  return items;
}

function sortByDirectory(docs: Document[]): Document[] {
  let onlyDirs: Document[] = [];
  let onlyFiles: Document[] = [];

  docs.forEach((doc) => {
    if(doc.isDir){
      onlyDirs.push(doc);
    } else {
      onlyFiles.push(doc);
    }
  });

  return onlyDirs.concat(onlyFiles);
}


export class DocumentationProvider implements vscode.TreeDataProvider<Document> {

  private _onDidChangeTreeData: vscode.EventEmitter<Document | undefined | null | void> = new vscode.EventEmitter<Document | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Document | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Document): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Document): Thenable<Document[]> {
    if (element) {
      if (element.isDir) {
        const globalPath = element.uri.fsPath;
        let files: string[] = getFilesFolders(globalPath);
        
        let docArray: Document[] = [];
        files.forEach((value) => {
          let uriFile = vscode.Uri.file(path.join(globalPath, value));
          const isDir = fs.lstatSync(path.join(globalPath, value)).isDirectory();
          let doc = new Document(value, isDir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, uriFile, isDir);
          docArray.push(doc);
        });

        docArray = sortByDirectory(docArray);

        return Promise.resolve(docArray);
      }

      return Promise.resolve([]);
    } else {
      const globalPath = vscode.workspace.getConfiguration('doc').get('path', '');

      let files: string[] = getFilesFolders(globalPath);

      let docArray: Document[] = [];
      files.forEach((value) => {
        let uriFile = vscode.Uri.file(path.join(globalPath, value));
        const isDir = fs.lstatSync(path.join(globalPath, value)).isDirectory();
        let doc = new Document(value, isDir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, uriFile, isDir);
        docArray.push(doc);
      });

      docArray = sortByDirectory(docArray);

      return Promise.resolve(docArray);
    }
  }
}

export class Document extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public uri: vscode.Uri,
    public isDir: boolean
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.uri.fsPath}`;
    this.uri = uri;
    this.isDir = isDir;

    if (!isDir) {
      this.command = {
        command: 'vscode.open',
        title: "Open Document",
        arguments: [this.uri]
      };

      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'icons', 'light', 'file.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'icons', 'dark', 'file.svg')
      };
    }
    else {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'icons', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'icons', 'dark', 'folder.svg')
      };
    }
  }
}