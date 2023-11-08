import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getFilesFolders(path: string): fs.Dirent[] {
  if(!fs.existsSync(path)){
    return [];
  }
  let items = fs.readdirSync(path, {withFileTypes: true, recursive: true});

  if(items.length === 0){
    vscode.window.showErrorMessage('The selected Documentation folder is empty!');
  }

  return items;
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
        let files: fs.Dirent[] = getFilesFolders(globalPath);
        
        let docArray: Document[] = [];
        files.forEach((value) => {
          let uriFile = vscode.Uri.file(path.join(globalPath, value.name));
          const isDir = value.isDirectory();
          let doc = new Document(value.name, isDir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, uriFile, isDir);
          docArray.push(doc);
        });

        return Promise.resolve(docArray);
      }

      return Promise.resolve([]);
    } else {
      const globalPath = vscode.workspace.getConfiguration('doc').get('path', '');
      let files: fs.Dirent[] = getFilesFolders(globalPath);

      let docArray: Document[] = [];
      files.forEach((value) => {
        let uriFile = vscode.Uri.file(path.join(globalPath, value.name));
        const isDir = value.isDirectory();
        let doc = new Document(value.name, isDir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, uriFile, isDir);
        docArray.push(doc);
      });

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