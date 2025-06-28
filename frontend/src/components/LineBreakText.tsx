import { Text, type TextProps } from '@chakra-ui/react';

interface LineBreakTextProps extends TextProps {
  text: string;
}

/**
 * 改行コード（\n, \\n）を正しく表示するテキストコンポーネント
 * 色はテーマの "text" を使用
 */
const LineBreakText = ({ text, ...rest }: LineBreakTextProps) => {
  // 文字列中の "\\n" を "\n" に変換（JSONなどから渡ってくる場合の対策）
  const formattedText = text.replace(/\\n/g, '\n');

  return (
    <Text whiteSpace="pre-line" {...rest} color="text">
      {formattedText}
    </Text>
  );
};

export default LineBreakText;
