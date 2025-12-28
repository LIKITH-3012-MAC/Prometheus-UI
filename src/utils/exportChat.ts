import jsPDF from "jspdf";

export function exportMarkdown(messages: any[]) {
  const md = messages
    .map(m => `**${m.role.toUpperCase()}**:\n${m.content}\n`)
    .join("\n");

  const blob = new Blob([md], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat.md";
  link.click();
}

export function exportPDF(messages: any[]) {
  const pdf = new jsPDF();
  let y = 10;

  messages.forEach(m => {
    pdf.text(`${m.role.toUpperCase()}:`, 10, y);
    y += 6;
    pdf.text(m.content, 10, y);
    y += 10;
  });

  pdf.save("chat.pdf");
}
