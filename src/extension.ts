'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import { DepNodeProvider } from './nodeDependencies'
import { JsonOutlineProvider } from './jsonOutline'
import { FtpExplorer } from './ftpExplorer.textDocumentContentProvider'

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const foo = new DepNodeProvider(rootPath, 0);
	foo.parseHTMLFile();

	//const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	const nodeDependenciesProvider1 = new DepNodeProvider(rootPath, 1);
	const nodeDependenciesProvider2 = new DepNodeProvider(rootPath, 2);
	const nodeDependenciesProvider3 = new DepNodeProvider(rootPath, 3);
	const nodeDependenciesProvider4 = new DepNodeProvider(rootPath, 4);
	const nodeDependenciesProvider5 = new DepNodeProvider(rootPath, 5);
	const jsonOutlineProvider = new JsonOutlineProvider(context);

	//vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.window.registerTreeDataProvider('nodeDependencies1', nodeDependenciesProvider1);
	vscode.window.registerTreeDataProvider('nodeDependencies2', nodeDependenciesProvider2);
	vscode.window.registerTreeDataProvider('nodeDependencies3', nodeDependenciesProvider3);
	vscode.window.registerTreeDataProvider('nodeDependencies4', nodeDependenciesProvider4);
	vscode.window.registerTreeDataProvider('nodeDependencies5', nodeDependenciesProvider5);
	
	//vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('nodeDependencies1.refreshEntry', () => nodeDependenciesProvider1.refresh());
	vscode.commands.registerCommand('nodeDependencies2.refreshEntry', () => nodeDependenciesProvider2.refresh());
	vscode.commands.registerCommand('nodeDependencies3.refreshEntry', () => nodeDependenciesProvider3.refresh());
	vscode.commands.registerCommand('nodeDependencies4.refreshEntry', () => nodeDependenciesProvider4.refresh());
	vscode.commands.registerCommand('nodeDependencies5.refreshEntry', () => nodeDependenciesProvider5.refresh());


	vscode.commands.registerCommand('nodeDependencies1.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies2.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies3.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies4.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies5.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));


	vscode.commands.registerCommand('nodeDependencies1.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies2.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies3.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies4.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies5.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));


	// This opens mnemonic documentation in a browser
	//vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.felixcloutier.com/x86/${moduleName}.html`)));

	// TEST: open up inside VS Code
	//var myExtDir = vscode.extensions.getExtension ("whiteout2.x86").extensionPath;
	//vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse(`file:///Users/RG/Documents/comp/whiteout2/tree-view-sample-x86/${moduleName}.html`)));
	//vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse('file://' + myExtDir + '/instruction.html?q=AAA')));
	//vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse('Test')));
	vscode.commands.registerCommand('extension.openPackageOnNpm', (moduleName, moduleLink) => viewInstruction(moduleName, moduleLink));

	// NOTE: vscode.previewHtml only takes local files, not http resources. To show a webpage inside
	// VS Code open a html file and let that file open a webpage inside an iframe
	// HELL: VS Code strips query strings and iframes do not look good.
	// Or use TextDocumentContentProvider ???
	// Or simply download the file first
	// Or just ship entire website files with the extension (lame)
	// But how to find the path to the local file. Is there a variable indicating the current extension dir?


	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
	vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
	vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));

	new FtpExplorer(context);
}


function viewInstruction(moduleName, moduleLink)
{
	console.log("Item clicked: ", moduleName);

	// TODO: 
	// - Check if file is already in /x86 cache to skip the download (not really necessary)
	// - Get rid of hardcoded /Users/RG/Documents/comp/whiteout2/tree-view-sample-x86/
	
	var myExtDir = vscode.extensions.getExtension ("whiteout2.arm").extensionPath;
/* 					
	var request = require('request');
	request.get(`https://www.felixcloutier.com/x86/${moduleLink}`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// strip <header></header>
			var body1 = body.slice(0, body.indexOf('<header>'));
			var body2 = body.slice(body.indexOf('</header>')+9, body.length);
			body = body1 + body2;

			// NOTE: Some html files have : in their names. Mac turns them to /
			// Windows refuses to write them.
			// NOTE2: When there is a file with / in the name in the /x86 directory and we publish
			// the package, it won't install on Windows. Also, when we empty the /x86 directory 
			// before publication to remedy this, the extension won't work because empty directories
			// won't be packaged/published and the /x86 dir is needed.
			// TODO: Change all : into _
			// DONE:
			var regex = /:/gi;
			var cleanFileName = moduleLink.replace(regex, '_');

			// TODO: Extra check that /x86 dir exists, if not create it. But we should already
			// have created it when extension installs
			// DONE:
			if (!fs.existsSync(myExtDir + `/arm`)) {
				fs.mkdirSync(myExtDir + `/arm`);
			}
			fs.writeFileSync(myExtDir + `/arm/${cleanFileName}`, body);
*/	
			// TODO: previewHtml is deprecated, use Webview API
			//vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse(`file://` + myExtDir + `/x86/${moduleLink}`), 1, `${moduleName}`);
			// Create and show panel
			const panel = vscode.window.createWebviewPanel(
				'catCoding',
				`${moduleName}`,
				vscode.ViewColumn.One,
				{
					// Only allow the webview to access resources in our extension's media directory
					//localResourceRoots: [vscode.Uri.file(myExtDir + '/arm/xhtml_a64')]
				}
			);

			// And set its HTML content
			//panel.webview.html = body;
 		
			// TEST: ARM show html file in webview
			// TODO: make css work. Not easy. See: https://stackoverflow.com/questions/56182144/vscode-extension-webview-external-html-and-css
			// Since webview adapts the contents for the color themes better not use css but just change
			// some html before showing:
			// <table class="regdiagram" => <table class="regdiagram" border=1 cellspacing=0
			// <p class="pseudocode" => <pre class="pseudocode"
			// <a id="execute"/> => 
			// And also hack off page headers and footers
			// NOTE: inline css works
			var body3 = '';
			//fs.readFile(myExtDir + '/arm/xhtml_a64/adc.html', 'utf8', function(err, data) {
			fs.readFile(myExtDir + '/arm/xhtml_a64/' + moduleLink, 'utf8', function(err, data) {
				if (err) throw err;
				// DAMN: cannot use a variable like this: if we leave the scope body3 will be empty
				// It is the callback shit again.
				body3 = data;
				
				// HACK:
				body3 = body3.replace('<table class="regdiagram">', '<table class="regdiagram" border=1 cellspacing=0>');
				body3 = body3.replace(/<p class="pseudocode">/g, '<p class="pseudocode" style="white-space: pre; font-family: courier, monospace; background-color: #FF0000;">');
				body3 = body3.replace(/<p class="asm-code">/g, '<p class="asm-code" style="white-space: pre; font-family: courier, monospace; background-color: #FF0000;">');
				body3 = body3.replace('<a id="execute"/>', '');
				// cut header
				body3 = body3.replace('<body>', '<body><!--');
				body3 = body3.replace('</table><hr/>', '</table><hr/>-->');
				// cut footer
				body3 = body3.replace('<hr/><table style="margin: 0 auto;">', '<!--<hr/><table style="margin: 0 auto;">');
				body3 = body3.replace('</body>', '--></body>');
				
				//console.log(body3);
				panel.webview.html = body3;
			});

			// HACK:
			// NONO: do in anonymous function, body3 will be empty here!!!
			//body3 = body3.replace('<table class="regdiagram">', '<table class="regdiagram" border=1 cellspacing=0>');
			//console.log(body3);
			//panel.webview.html = body3;
			
/* 
		} // End: if (!error
	}); // End: request.get()
 */
}