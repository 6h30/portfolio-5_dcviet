import {
  Cmd,
  CmdDesc,
  CmdList,
  HelpWrapper,
  KeyContainer,
} from "../styles/Help.styled";
import { commands } from "../terminal1";
import { generateTabs } from "app/lib/funcs";

const Help: React.FC = () => {
  return (
    <HelpWrapper data-testid="help">
      {commands.map(({ cmd, desc, tab }) => (
        <CmdList key={cmd}>
          <Cmd>{cmd}</Cmd>
          {generateTabs(tab)}
          <CmdDesc>- {desc}</CmdDesc>
        </CmdList>
      ))}
      <KeyContainer>
        <div>Tab hoặc Ctrl + i&nbsp; =&gt; tự động hoàn thành lệnh</div>
        <div>Phím lên {generateTabs(5)} =&gt; lệnh trước đó</div>
        <div>Ctrl + l {generateTabs(5)} =&gt; làm sạch màn hình terminal</div>
      </KeyContainer>
    </HelpWrapper>
  );
};

export default Help;
