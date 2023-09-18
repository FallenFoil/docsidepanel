import * as vscode from 'vscode';

import { DocumentationProvider, Document } from './TreeDataProvider';
import { cutFile, copyFile, renameFile, deleteFile } from './fileOperations';
import { createFile, createFolder, collapseAll } from './folderOperations';

let docPath = '/home/fallenfoil/Projects/vscode-extensions/docsidepanel/docTest';

export function activate(context: vscode.ExtensionContext) {
	const documentProvider: DocumentationProvider = new DocumentationProvider();
	vscode.window.registerTreeDataProvider('documents', documentProvider);

	const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(docPath), "*"));
	watcher.onDidChange(_ => documentProvider.refresh());
	watcher.onDidCreate(_ => documentProvider.refresh());
	watcher.onDidDelete(_ => documentProvider.refresh());

	let setDocumentationPath = vscode.commands.registerCommand('docsidepanel.documentationPath', () => {});
	let newFile = vscode.commands.registerCommand('docsidepanel.newFile', () => createFile());
	let newFolder = vscode.commands.registerCommand('docsidepanel.newFolder', () => createFolder());
	let refresh = vscode.commands.registerCommand('docsidepanel.refresh', () => documentProvider.refresh());
	let collapse = vscode.commands.registerCommand('docsidepanel.collapse', () => collapseAll());
	let fileCut = vscode.commands.registerCommand('docsidepanel.file.cut', (doc: Document) => cutFile());
	let fileCopy = vscode.commands.registerCommand('docsidepanel.file.copy', (doc: Document) => copyFile());
	let fileRename = vscode.commands.registerCommand('docsidepanel.file.rename', (doc: Document) => renameFile());
	let fileDelete = vscode.commands.registerCommand('docsidepanel.file.delete', (doc: Document) => deleteFile());

	context.subscriptions.push(setDocumentationPath);
	context.subscriptions.push(newFile);
	context.subscriptions.push(newFolder);
	context.subscriptions.push(refresh);
	context.subscriptions.push(collapse);
	context.subscriptions.push(fileCut);
	context.subscriptions.push(fileCopy);
	context.subscriptions.push(fileRename);
	context.subscriptions.push(fileDelete);
}

export function deactivate() {}
