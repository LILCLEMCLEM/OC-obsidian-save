/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const PLUGIN_NAME = "Multi-line Formatting";
const DEFAULT_SETTINGS = {
    styleArray: [
        {
            id: "multi-line-format-cyan-highlight",
            nickname: "Cyan Highlighter, even over multiple lines",
            leftStyle: '<span style="background-color:#00FEFE">',
            rightStyle: "</span>",
            skipHeadings: false,
            skipListItems: false,
            skipBlockquotes: false,
            formatWord: false,
        },
        {
            id: "multi-line-format-bold",
            nickname: "Bold, even over multiple lines",
            leftStyle: "**",
            rightStyle: "**",
            skipHeadings: false,
            skipListItems: false,
            skipBlockquotes: false,
            formatWord: false,
        },
    ],
};
const NEW_STYLE_DEFAULTS = {
    id: "",
    nickname: "Empty format",
    leftStyle: "",
    rightStyle: "",
    skipHeadings: false,
    skipListItems: false,
    skipBlockquotes: false,
    formatWord: false,
};
class MultilineFormattingPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Loading " + PLUGIN_NAME + " Plugin");
            yield this.loadSettings();
            for (const style of this.settings.styleArray) {
                this.addStyleCommand(style);
            }
            this.addSettingTab(new MultilineFormattingSettingTab(this.app, this));
        });
    }
    onunload() {
        console.log("Unloading " + PLUGIN_NAME + "Plugin");
    }
    formatSelection(editor, view, style) {
        const cache = this.app.metadataCache.getCache(view.file.path);
        const sections = cache.sections;
        const formatter = new Formatter(style);
        formatter.formatSelection(editor, sections);
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    addStyleCommand(style) {
        this.addCommand({
            id: style.id,
            name: style.nickname,
            editorCallback: (editor, view) => {
                this.formatSelection(editor, view, style);
            },
        });
    }
    addFormattingStyle() {
        const id = String(Math.abs((Date.now() ^ (Math.random() * (1 << 30))) % (1 << 30)));
        const newStyle = Object.assign(Object.assign({}, NEW_STYLE_DEFAULTS), { id: id });
        this.settings.styleArray.push(newStyle);
        this.addStyleCommand(newStyle);
        return newStyle;
    }
    deleteFormattingStyle(style) {
        const index = this.settings.styleArray.indexOf(style);
        if (index >= 0) {
            this.settings.styleArray.splice(index, 1);
        }
        //@ts-ignore
        const appCommands = this.app.commands;
        if (appCommands.findCommand(style.id)) {
            delete appCommands.editorCommands[style.id];
            delete appCommands.commands[style.id];
        }
    }
}
function sectionBinarySearch(line, sections) {
    let low = 0;
    let high = -1;
    if (sections) {
        high = sections.length;
    }
    while (low < high) {
        const midpoint = low + ((high - low) >> 1);
        const midposition = sections[midpoint].position;
        if (line < midposition.start.line) {
            /* cursor before middle section */
            high = midpoint;
        }
        else if (line <= midposition.end.line) {
            /* cursor in middle section */
            return midpoint;
        }
        else {
            /* cursor after middle section */
            low = midpoint + 1;
        }
    }
    /* this might not be the right thing to do. */
    return low;
}
class MultilineFormattingSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Settings for " + PLUGIN_NAME });
        const allStyleDiv = containerEl.createEl("div");
        for (const style of this.plugin.settings.styleArray) {
            const div = this.formattingStyleSetting(style);
            allStyleDiv.appendChild(div);
        }
        new obsidian.Setting(containerEl).addButton((t) => {
            t.setButtonText("Add new formatting style");
            t.onClick((v) => __awaiter(this, void 0, void 0, function* () {
                const newStyle = this.plugin.addFormattingStyle();
                const div = this.formattingStyleSetting(newStyle);
                allStyleDiv.appendChild(div);
            }));
        });
    }
    formattingStyleSetting(style) {
        const containerEl = document.createElement("div");
        const commandheader = containerEl.createEl("h3", {
            text: "Settings for " + style.nickname,
        });
        new obsidian.Setting(containerEl)
            .setName("Nickname")
            .setDesc("The name for your formatting command in the command palette.")
            .addText((text) => text
            // .setPlaceholder('')
            .setValue(style.nickname)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            style.nickname = value;
            commandheader.setText("Settings for " + style.nickname);
            this.plugin.addStyleCommand(style);
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Left")
            .setDesc("The opening tag, or the left part of a highlight (==), bold (**), etc.")
            .addTextArea((text) => text
            .setPlaceholder("")
            .setValue(style.leftStyle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            style.leftStyle = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Right")
            .setDesc("The closing tag, or the right part of a highlight (==), bold (**), etc.")
            .addTextArea((text) => text
            .setPlaceholder("")
            .setValue(style.rightStyle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            style.rightStyle = value;
            yield this.plugin.saveSettings();
        })));
        // const skipDetails: HTMLDetailsElement = containerEl.createEl("details");
        // skipDetails.createEl("summary", { text: "Skip some section types" });
        // new Setting(skipDetails)
        //   .setName('Skip List Items')
        //   .setDesc('Turn this toggle ON to exclude text in list items.')
        //   .addToggle((t) => {
        //     t.setValue(style.skipListItems);
        //     t.onChange(async (v) => {
        //       style.skipListItems = v;
        //       await this.plugin.saveSettings();
        //     })
        //   });
        new obsidian.Setting(containerEl)
            .setName("Skip Headings")
            .setDesc("Turn this toggle ON to exclude text in headings.")
            .addToggle((t) => {
            t.setValue(style.skipHeadings);
            t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                style.skipHeadings = v;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Format word if selection is empty")
            .setDesc("Turn this toggle ON if you want the command to format the word that the cursor is touching when nothing is selected.")
            .addToggle((t) => {
            t.setValue(style.formatWord);
            t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                style.formatWord = v;
                yield this.plugin.saveSettings();
            }));
        });
        // new Setting(skipDetails)
        //     .setName('Skip Blockquotes')
        //     .setDesc('Turn this toggle ON to exclude text in blockquotes.')
        //     .addToggle((t) => {
        //       t.setValue(style.skipBlockquotes);
        //       t.onChange(async (v) => {
        //         style.skipBlockquotes = v;
        //         await this.plugin.saveSettings();
        //       })
        //     });
        new obsidian.Setting(containerEl).addButton((t) => {
            t.setButtonText("Delete this style");
            t.onClick((v) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (confirm("Are you sure you want to delete " + style.nickname + "?")) {
                    (_a = containerEl.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(containerEl);
                    this.plugin.deleteFormattingStyle(style);
                }
            }));
        });
        return containerEl;
    }
}
const HEADING_REGEX = /^(?<prefix>\s*#{1,6}\s+)(?<remainder>.*)$/;
const BLOCKQUOTE_REGEX = /^(?<prefix>\s*>\s*)(?<remainder>.*)$/;
const LIST_REGEX = /^(?<prefix>\s*(\*|\+|-|\d+\.|\d+\))\s+(\[.\]\s+)?)(?<remainder>.*)$/;
const LEFT_TRIM_REGEX = /^(?<prefix>\s*)(?<remainder>.*)$/;
const WHITESPACE_ONLY_REGEX = /^\s*$/;
class Formatter {
    constructor(style) {
        this.replacement = [];
        this.style = style;
        this.lastNonEmptyIndex = -1;
        this.isPrecededByParagraphBreak = true;
        this.previousBlockquoteLevel = 0;
        this.blockquoteLevelSoFar = 0;
    }
    formatSelection(doc, sections) {
        const start = doc.getCursor("from");
        const end = doc.getCursor("to");
        if (start.ch == end.ch && start.line == end.line) {
            const line = doc.getLine(end.line);
            if (!this.style.formatWord) {
                doc.replaceSelection(this.style.leftStyle + this.style.rightStyle);
                doc.setCursor(start.line, start.ch + this.style.leftStyle.length);
                return;
            }
            else {
                const left = line.substring(0, end.ch).match(/\S*$/);
                const right = line.substring(end.ch).match(/^\S*/);
                const replacementLine = line.substring(0, left["index"]) +
                    this.style.leftStyle +
                    left[0] +
                    right[0] +
                    this.style.rightStyle +
                    line.substring(end.ch + right[0].length);
                doc.setLine(end.line, replacementLine);
                doc.setCursor(end.line, end.ch + this.style.leftStyle.length);
            }
        }
        for (let lineNum = start.line; lineNum <= end.line; lineNum++) {
            const line = doc.getLine(lineNum);
            this.blockquoteLevelSoFar = 0;
            const startCol = lineNum == start.line ? start.ch : 0;
            const endCol = lineNum == end.line ? end.ch : line.length;
            const parsedLineType = getLineType(line);
            if (sections) {
                const currentSectionIndex = sectionBinarySearch(lineNum, sections);
                if (sections[currentSectionIndex].type == "code") {
                    parsedLineType.desc = "code";
                }
            }
            this.replacement.push(this.processLine(line, startCol, endCol, parsedLineType));
        }
        this.applyRightAbove();
        doc.replaceSelection(this.getReplacement());
    }
    getReplacement() {
        return this.replacement.join("\n");
    }
    processRemainder(remainder, startCh, endCh) {
        const lineType = getLineType(remainder);
        return this.processLine(remainder, startCh, endCh, lineType);
    }
    processLine(line, startCol, endCol, lineType) {
        const { desc, prefix, remainder } = lineType;
        if (desc === "blockquote") {
            this.blockquoteLevelSoFar += 1;
        }
        if (desc === "code") {
            return line.substring(startCol, endCol);
        }
        return (prefix.substring(startCol, endCol) +
            this[desc](remainder, startCol - prefix.length, endCol - prefix.length));
    }
    blockquote(remainder, startCh, endCh) {
        console.debug("bq-level:", this.blockquoteLevelSoFar, "previous:", this.previousBlockquoteLevel);
        if (this.previousBlockquoteLevel < this.blockquoteLevelSoFar) {
            this.isPrecededByParagraphBreak = true;
            this.applyRightAbove();
            this.previousBlockquoteLevel = this.blockquoteLevelSoFar;
        }
        return this.processRemainder(remainder, startCh, endCh);
    }
    heading(remainder, startCh, endCh) {
        const selectedRemainder = remainder.substring(startCh, endCh);
        console.debug("This is a heading");
        this.applyRightAbove();
        this.isPrecededByParagraphBreak = true;
        if (selectedRemainder.search(WHITESPACE_ONLY_REGEX) >= 0 ||
            this.style.skipHeadings) {
            return selectedRemainder;
        }
        else {
            this.setCurrentLineNonEmpty();
            return this.style.leftStyle + selectedRemainder;
        }
    }
    list(remainder, startCh, endCh) {
        this.isPrecededByParagraphBreak = true;
        return this.processRemainder(remainder, startCh, endCh);
    }
    paragraph(remainder, startCh, endCh) {
        if (remainder == "") {
            this.isPrecededByParagraphBreak = true;
            this.previousBlockquoteLevel = this.blockquoteLevelSoFar;
            return remainder;
        }
        else if (remainder.substring(startCh, endCh).search(WHITESPACE_ONLY_REGEX) >= 0) {
            return remainder.substring(startCh, endCh);
        }
        else {
            let returnable;
            if (this.isPrecededByParagraphBreak) {
                this.isPrecededByParagraphBreak = false;
                this.applyRightAbove();
                returnable = this.style.leftStyle + remainder.substring(startCh, endCh);
            }
            else {
                returnable = remainder.substring(startCh, endCh);
            }
            this.setCurrentLineNonEmpty();
            return returnable;
        }
    }
    setCurrentLineNonEmpty() {
        this.lastNonEmptyIndex = this.replacement.length;
    }
    applyRightAbove() {
        if (this.lastNonEmptyIndex >= 0 && this.replacement.length > 0) {
            const [, rightTrimmed, endWhitespace] = this.replacement[this.lastNonEmptyIndex].match(/^(.*?)(\s*)$/);
            this.replacement[this.lastNonEmptyIndex] =
                rightTrimmed + this.style.rightStyle + endWhitespace;
            this.lastNonEmptyIndex = -1;
            return true;
        }
        else
            return false;
    }
}
function getLineType(line) {
    const headingMatch = line.match(HEADING_REGEX);
    if (headingMatch != null) {
        console.debug("HeadingMatch:", headingMatch);
        const { prefix, remainder } = headingMatch.groups;
        return { desc: "heading", prefix, remainder };
    }
    const listMatch = line.match(LIST_REGEX);
    if (listMatch != null) {
        const { prefix, remainder } = listMatch.groups;
        return { desc: "list", prefix, remainder };
    }
    const blockquoteMatch = line.match(BLOCKQUOTE_REGEX);
    if (blockquoteMatch != null) {
        const { prefix, remainder } = blockquoteMatch.groups;
        return { desc: "blockquote", prefix, remainder };
    }
    const { prefix, remainder } = line.match(LEFT_TRIM_REGEX).groups;
    return { desc: "paragraph", prefix, remainder };
}

module.exports = MultilineFormattingPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFB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
