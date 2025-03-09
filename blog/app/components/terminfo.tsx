import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";

const TermInfo = () => {
  return (
    <Wrapper className="code-font">
      <User>PT E:\</User>@<WebsiteName>portfolio-5.site</WebsiteName>:~$
    </Wrapper>
  );
};

export default TermInfo;