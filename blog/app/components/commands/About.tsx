import {
  AboutWrapper,
  HighlightAlt,
  HighlightSpan,
} from "../styles/About.styled";

const About: React.FC = () => {
  return (
    <AboutWrapper data-testid="about">
      <p>
        Hi, tôi là <HighlightSpan>dcviet</HighlightSpan>!
      </p>
      <p>
        Tôi là <HighlightAlt>lập trình viên tự do</HighlightAlt> đến từ Viêt Nam.
      </p>
      <p> Tôi đam mê lập trình và phát triển ứng dụng web, tôi dùng lập trình để tạo ra những giải pháp có ý nghĩa, tối ưu và bền vững, giúp giải quyết những thách thức thực tế một cách hiệu quả. </p>
    </AboutWrapper>
  );
};

export default About;
