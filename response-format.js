/* ORACLE Response Format Engine
 * Chooses a light presentation style for each answer and normalizes interactive choices.
 * Keep content decisions with the model; this module handles display, not generation.
 */
(() => {
  "use strict";

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function classify(userText, answerText) {
    const user = String(userText || "").toLowerCase();
    const answer = String(answerText || "");
    if (/\[\[choices\]\][\s\S]*?\[\[\/choices\]\]/i.test(answer)) return "choices";
    if (/\b(compare|comparison|versus|\bvs\.?\b|difference between|pros and cons|which is better)\b/.test(user)) return "comparison";
    if (/\b(step[- ]by[- ]step|how do i|how to|instructions|tutorial|walk me through)\b/.test(user)) return "steps";
    if (/\b(report|research|analysis|analyze|analyse|breakdown|detailed explanation)\b/.test(user)) return "report";
    if (/\b(code|script|program|debug|error|function|html|css|javascript|python)\b/.test(user) ||
        /\x60{3}[\s\S]*\x60{3}/.test(answer)) return "technical";
    if (/^\s{0,3}#{1,3}\s/m.test(answer) || /^\s*\|.*\|\s*$/m.test(answer) ||
        /^\s*[-*]\s/m.test(answer)) return "structured";
    return "conversation";
  }

  function normalize(text) {
    return String(text || "")
      .replace(/\\\|/g, "|")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();
  }

  function getChoiceBlock(text) {
    const match = String(text || "").match(/\[\[choices\]\]([\s\S]*?)\[\[\/choices\]\]/i);
    return match ? { full: match[0], body: match[1] } : null;
  }

  function parseChoices(text) {
    const block = getChoiceBlock(text);
    if (!block) return [];
    const choices = [];
    for (const line of block.body.split(/\r?\n/)) {
      let item = line.trim();
      if (!item) continue;
      item = item.replace(/^(?:[-*+•]|\d+[.)])\s*/, "").trim();
      item = item.replace(/^\*\*(.*?)\*\*$/, "$1").replace(/^["'“”‘’]|["'“”‘’]$/g, "").trim();
      if (!item || item.length > 100 || /^\[\[\/?choices\]\]$/i.test(item)) continue;
      if (!choices.some(existing => existing.toLowerCase() === item.toLowerCase())) choices.push(item);
    }
    return choices.slice(0, 6);
  }

  function stripChoiceBlock(text) {
    return normalize(text).replace(/\[\[choices\]\][\s\S]*?\[\[\/choices\]\]/i, "").trim();
  }

  function userExplicitlyAskedForImages(text) {
    const value = String(text || "");
    return /\b(show|find|search for|generate|create|make|give me|display|send)\b.{0,45}\b(images?|pictures?|photos?|wallpapers?|illustrations?|visual references?)\b/i.test(value) ||
      /\b(images?|pictures?|photos?|wallpapers?|illustrations?)\b.{0,35}\b(of|for|show|generate|create|find|please)\b/i.test(value) ||
      /\bwhat does .{2,70} look like\b/i.test(value);
  }

  window.OracleResponseFormat = Object.freeze({
    classify, normalize, getChoiceBlock, parseChoices, stripChoiceBlock, userExplicitlyAskedForImages
  });
})();
