import * as vscode from 'vscode';

import { DocumentationProvider, Document } from './TreeDataProvider';

let docPath = '/home/fallenfoil/Projects/vscode-extensions/docsidepanel/docTest';

export function activate(context: vscode.ExtensionContext) {
	const documentProvider: DocumentationProvider = new DocumentationProvider();
	vscode.window.registerTreeDataProvider('documents', documentProvider);

	const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(docPath), "*"));
	watcher.onDidChange(_ => documentProvider.refresh());
	watcher.onDidCreate(_ => documentProvider.refresh());
	watcher.onDidDelete(_ => documentProvider.refresh());
}

export function deactivate() {}
