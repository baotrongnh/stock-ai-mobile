function formatText(text) {
  // Kiểm tra nếu text không phải là chuỗi hoặc là undefined/null
  if (!text || typeof text !== 'string') {
    return ''; // Trả về chuỗi rỗng hoặc xử lý lỗi theo cách bạn muốn
  }

  // Loại bỏ các ký tự \\n và thay bằng xuống dòng thực tế \n
  let formattedText = text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');

  // Tách các đoạn văn và làm sạch
  const paragraphs = formattedText.split('\n\n').map(paragraph =>
    paragraph.trim().replace(/\n/g, ' ')
  );

  // Kết hợp lại các đoạn văn với xuống dòng
  return paragraphs.join('\n\n');
}
export { formatText }