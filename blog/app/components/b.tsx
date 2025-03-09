import React, { Component } from "react";
// import { evaluate } from 'mathjs';
import * as math from "mathjs";

type Command = {
  command: string;
  purpose: string;
  help?: string[];
  isMain?: boolean;
};

type FieldState = {
  commandHistory: string[];
  commandHistoryIndex: number;
  fieldHistory: {
    text?: string | string[];
    hasBuffer?: boolean;
    isCommand?: boolean;
    isError?: boolean;
  }[];
  userInput: string;
  isMobile: boolean;
};

type FieldProps = {
  setTheme: (theme: string) => void;
  setTitle: (title: string) => void;
  theme: {
    app: {
      backgroundColor: string;
    };
    field: React.CSSProperties;
    cursor: React.CSSProperties;
  };
};

class Field extends Component<FieldProps, FieldState> {
  private recognizedCommands: Command[];

  constructor(props: FieldProps) {
    super(props);
    this.state = {
      commandHistory: [],
      commandHistoryIndex: 0,
      fieldHistory: [
        { text: "Portfolio Terminal" },
        { text: "Nhập HELP để xem danh sách lệnh đầy đủ.", hasBuffer: true },
      ],
      userInput: "",
      isMobile: false,
    };

    this.recognizedCommands = [
      {
        command: "help",
        purpose: "Cung cấp thông tin trợ giúp cho các lệnh Terminal.",
      },
      { command: "date", purpose: "Hiển thị ngày hiện tại." },
      {
        command: "start",
        purpose:
          "Khởi chạy một URL được chỉ định trong một tab mới hoặc cửa sổ riêng biệt.",
        help: [
          "START <URL>",
          "Khởi chạy một URL được chỉ định trong một tab mới hoặc cửa sổ riêng biệt.",
          "",
          "URL......................Trang web bạn muốn mở.",
        ],
      },
      { command: "cls", purpose: "Làm sạch màn hình." },
      {
        command: "cmd",
        purpose: "Bắt đầu một phiên bản mới của Portfolio Terminal.",
      },
      {
        command: "theme",
        purpose: "Thiết lập bảng màu của Portfolio Terminal.",
        help: [
          "THEME <L|LIGHT|D|DARK> [-s, -save]",
          "Sets the color scheme of the React Terminal.",
          "",
          "L, LIGHT.................Sets the color scheme to light mode.",
          "D, DARK..................Sets the color scheme to dark mode.",
          "",
          "-s, -save................Saves the setting to localStorage.",
        ],
      },
      {
        command: "exit",
        purpose:
          "Thoát khỏi Portfolio Terminal và quay lại trang giới thiệu của dcviet",
      },
      { command: "time", purpose: "Hiển thị thời gian hiện tại." },
      {
        command: "about",
        isMain: true,
        purpose: "Hiển thị thông tin cơ bản về dcviet.",
      },
      {
        command: "experience",
        isMain: true,
        purpose: "Hiển thị thông tin về trải nghiệm của dcviet.",
      },
      {
        command: "skills",
        isMain: true,
        purpose:
          "Hiển thị thông tin về kỹ năng của dcviet với tư cách là một nhà phát triển.",
      },
      {
        command: "contact",
        isMain: true,
        purpose: "Hiển thị thông tin liên lạc của dcviet.",
      },
      {
        command: "projects",
        isMain: true,
        purpose:
          "Hiển thị thông tin về các dự án dcviet đã thực hiện trong quá khứ.",
      },
      {
        command: "project",
        isMain: true,
        purpose:
          "Khởi chạy một dự án được chỉ định trong một tab mới hoặc cửa sổ riêng.",
        help: [
          "PROJECT <TITLE>",
          "Khởi chạy một dự án được chỉ định trong một tab mới hoặc cửa sổ riêng.",
          "Danh sách các dự án hiện tại bao gồm:",
          "Minesweeper",
          "PuniUrl",
          "Taggen",
          "Forum",
          "Simon",
          "",
          "TITLE....................Tiêu đề của dự án bạn muốn xem.",
        ],
      },
      {
        command: "title",
        purpose: "Đặt tiêu đề cửa sổ cho Portfolio Terminal.",
        help: [
          "TITLE <INPUT>",
          "Đặt tiêu đề cửa sổ cho Portfolio Terminal.",
          "",
          "INPUT....................Tiêu đề bạn muốn sử dụng cho cửa sổ Portfolio Terminal.",
        ],
      },
      ...["google", "duckduckgo", "bing"].map((cmd) => {
        const properCase =
          cmd === "google"
            ? "Google"
            : cmd === "duckduckgo"
            ? "DuckDuckGo"
            : "Bing";
        return {
          command: cmd,
          purpose: `Searches a given query using ${properCase}.`,
          help: [
            `${cmd.toUpperCase()} <QUERY>`,
            `Tìm kiếm một truy vấn nhất định bằng ${properCase}. Nếu không có truy vấn nào được cung cấp, chỉ cần khởi chạy ${properCase}.`,
            "",
            `QUERY....................It's the same as if you were to type inside the ${properCase} search bar.`,
          ],
        };
      }),
    ];

    this.handleTyping = this.handleTyping.bind(this);
    this.handleInputEvaluation = this.handleInputEvaluation.bind(this);
    this.handleInputExecution = this.handleInputExecution.bind(this);
    this.handleContextMenuPaste = this.handleContextMenuPaste.bind(this);
  }
  
  componentDidMount() {
    if (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    ) {
      this.setState((state) => ({
        isMobile: true,
        fieldHistory: [
          ...state.fieldHistory,
          { isCommand: true },
          {
            text: `Thật không may vì ứng dụng này là môi trường 'không cần nhập liệu' nên thiết bị di động không được hỗ trợ. Tôi đang tìm cách khắc phục điều này, vì vậy hãy kiên nhẫn với tôi! Trong thời gian chờ đợi, hãy quay lại nếu bạn đang sử dụng máy tính để bàn.`,
            isError: true,
            hasBuffer: true,
          },
        ],
      }));
    } else {
      const userElem = document.querySelector("#field") as HTMLElement;
      const themePref = window.localStorage.getItem("reactTerminalThemePref");

      userElem.focus();

      document.querySelector("#useless-btn")?.addEventListener("click", () =>
        this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            { isCommand: true },
            {
              text: "SYS >> That button doesn't do anything.",
              hasBuffer: true,
            },
          ],
        }))
      );

      if (themePref) {
        this.props.setTheme(themePref);
      }
    }
  }

  componentDidUpdate() {
    const userElem = document.querySelector("#field") as HTMLElement;
    userElem.scrollTop = userElem.scrollHeight;
  }

  handleTyping(e: KeyboardEvent) {
    e.preventDefault();

    const { key, ctrlKey, altKey } = e;
    const forbidden = [
      ...Array.from({ length: 12 }, (_, y) => `F${y + 1}`),
      "ContextMenu",
      "Meta",
      "NumLock",
      "Shift",
      "Control",
      "Alt",
      "CapsLock",
      "Tab",
      "ScrollLock",
      "Pause",
      "Insert",
      "Home",
      "PageUp",
      "Delete",
      "End",
      "PageDown",
    ];

    if (!forbidden.includes(key) && !ctrlKey && !altKey) {
      if (key === "Backspace") {
        this.setState((state) => ({ userInput: state.userInput.slice(0, -1) }));
      } else if (key === "Escape") {
        this.setState({ userInput: "" });
      } else if (key === "ArrowUp" || key === "ArrowLeft") {
        const { commandHistory, commandHistoryIndex } = this.state;
        if (commandHistoryIndex < commandHistory.length) {
          this.setState((state) => ({
            commandHistoryIndex: state.commandHistoryIndex + 1,
            userInput: state.commandHistory[state.commandHistoryIndex] || "",
          }));
        }
      } else if (key === "ArrowDown" || key === "ArrowRight") {
        if (this.state.commandHistoryIndex > 0) {
          this.setState((state) => ({
            commandHistoryIndex: state.commandHistoryIndex - 1,
            userInput:
              state.commandHistory[state.commandHistoryIndex - 1] || "",
          }));
        }
      } else if (key === "Enter") {
        const { userInput } = this.state;

        if (userInput.length) {
          this.setState(
            (state) => ({
              commandHistory: [userInput, ...state.commandHistory],
              commandHistoryIndex: 0,
              fieldHistory: [
                ...state.fieldHistory,
                { text: userInput, isCommand: true },
              ],
              userInput: "",
            }),
            () => this.handleInputEvaluation(userInput)
          );
        } else {
          this.setState((state) => ({
            fieldHistory: [...state.fieldHistory, { isCommand: true }],
          }));
        }
      } else {
        this.setState((state) => ({ userInput: state.userInput + key }));
      }
    }
  }

  handleInputEvaluation(input: string) {
    try {
      const evaluatedForArithmetic = math.evaluate(input);

      if (!isNaN(evaluatedForArithmetic)) {
        return this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            { text: evaluatedForArithmetic.toString() },
          ],
        }));
      }

      throw new Error();
    } catch (err) {
      const { recognizedCommands, giveError, handleInputExecution } = this;
      const cleanedInput = input.toLowerCase().trim();
      const dividedInput = cleanedInput.split(" ");
      const parsedCmd = dividedInput[0];
      const parsedParams = dividedInput.slice(1).filter((s) => s[0] !== "-");
      const parsedFlags = dividedInput.slice(1).filter((s) => s[0] === "-");
      const isError = !recognizedCommands.some((s) => s.command === parsedCmd);

      if (isError) {
        return this.setState((state) => ({
          fieldHistory: [...state.fieldHistory, giveError("nr", input)],
        }));
      }

      return handleInputExecution(parsedCmd, parsedParams, parsedFlags);
    }
  }

  handleInputExecution(
    cmd: string,
    params: string[] = [],
    flags: string[] = []
  ) {
    if (cmd === "help") {
      if (params.length) {
        if (params.length > 1) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              this.giveError("bp", { cmd: "HELP", noAccepted: 1 }),
            ],
          }));
        }

        const cmdsWithHelp = this.recognizedCommands.filter((s) => s.help);
        const matchedCommand = cmdsWithHelp.find(
          (s) => s.command === params[0]
        );
        const matchedAnyCommand = this.recognizedCommands.find(
          (s) => s.command === params[0]
        );

        if (matchedCommand) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              { text: matchedCommand.help, hasBuffer: true },
            ],
          }));
        } else if (matchedAnyCommand) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              {
                text: [
                  `No additional help needed for ${matchedAnyCommand.command.toUpperCase()}`,
                  matchedAnyCommand.purpose,
                ],
                hasBuffer: true,
              },
            ],
          }));
        }

        return this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            this.giveError("up", params[0].toUpperCase()),
          ],
        }));
      }

      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Main commands:",
              ...this.recognizedCommands
                .filter(({ isMain }) => isMain)
                .map(
                  ({ command, purpose }) =>
                    `${command.toUpperCase()}${".".repeat(
                      15 - command.length
                    )}${purpose}`
                ),
              "",
              "All commands:",
              ...this.recognizedCommands.map(
                ({ command, purpose }) =>
                  `${command.toUpperCase()}${".".repeat(
                    15 - command.length
                  )}${purpose}`
              ),
              "",
              "For help about a specific command, type HELP <CMD>, e.g. HELP PROJECT.",
            ],
            hasBuffer: true,
          },
        ],
      }));
    }

    if (cmd === "cls") {
      return this.setState({ fieldHistory: [] });
    }

    if (cmd === "start" && params.length === 1) {
      return this.setState(
        (state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            { text: `Launching ${params[0]}...`, hasBuffer: true },
          ],
        }),
        () =>
          window.open(
            /^http/i.test(params[0]) ? params[0] : `https://${params[0]}`
          )
      );
    }

    if (cmd === "date") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: `The current date is: ${new Date().toLocaleDateString()}`,
            hasBuffer: true,
          },
        ],
      }));
    }

    if (cmd === "exit") {
      window.location.href = "https://behance.net/dcviet";
    }
  }

  handleContextMenuPaste(e: React.MouseEvent) {
    e.preventDefault();

    if ("clipboard" in navigator) {
      navigator.clipboard.readText().then((clipboard) =>
        this.setState((state) => ({
          userInput: `${state.userInput}${clipboard}`,
        }))
      );
    }
  }

  giveError(type: string, extra?: any) {
    const err = { text: "", isError: true, hasBuffer: true };

    if (type === "nr") {
      err.text = `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`;
    } else if (type === "nf") {
      err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`;
    } else if (type === "bf") {
      err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`;
    } else if (type === "bp") {
      err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameter(s) to use, type HELP ${extra.cmd}.`;
    } else if (type === "up") {
      err.text = `The command ${extra} is not supported by the HELP utility.`;
    }

    return err;
  }

  render() {
    const { theme } = this.props;
    const { fieldHistory, userInput } = this.state;

    return (
      <div
        id="field"
        className={theme.app.backgroundColor === "#333444" ? "dark" : "light"}
        style={theme.field}
        onKeyDown={(e) => this.handleTyping(e as unknown as KeyboardEvent)}
        tabIndex={0}
        onContextMenu={(e) => this.handleContextMenuPaste(e)}
      >
        {fieldHistory.map(({ text, isCommand, isError, hasBuffer }, index) => {
          if (Array.isArray(text)) {
            return (
              <MultiText
                key={index}
                input={text}
                isError={isError}
                hasBuffer={hasBuffer}
              />
            );
          }

          return (
            <Text
              key={index}
              input={text}
              isCommand={isCommand}
              isError={isError}
              hasBuffer={hasBuffer}
            />
          );
        })}
        <UserText input={userInput} theme={theme.cursor} />
      </div>
    );
  }
}

export default Field;

const MultiText = ({
  input,
  isError,
  hasBuffer,
}: {
  input: string[];
  isError?: boolean;
  hasBuffer?: boolean;
}) => (
  <div
    className={`multi-text ${isError ? "error" : ""} ${
      hasBuffer ? "buffer" : ""
    }`}
  >
    {input.map((line, index) => (
      <p key={index}>{line}</p>
    ))}
  </div>
);

const Text = ({
  input,
  isCommand,
  isError,
  hasBuffer,
}: {
  input?: string;
  isCommand?: boolean;
  isError?: boolean;
  hasBuffer?: boolean;
}) => (
  <p
    className={`text ${isCommand ? "command" : ""} ${isError ? "error" : ""} ${
      hasBuffer ? "buffer" : ""
    }`}
  >
    {input}
  </p>
);

const UserText = ({
  input,
  theme,
}: {
  input: string;
  theme: React.CSSProperties;
}) => (
  <p className="user-text" style={theme}>
    <span>RT C:\Users\Guest&gt; </span>
    {input}
  </p>
);
