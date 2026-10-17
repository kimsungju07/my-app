// 프로필 데이터 — 이 파일만 수정하면 사이트 내용이 바뀝니다.
const PROFILE = {
  name: "김성주",
  nameEn: "SungJu",
  email: "your-email@example.com",
  roles: ["Full-Stack Developer", "Backend Engineer", "Prompt Engineer"],
  summary:
    "LLM 프롬프트 설계부터 API·데이터베이스·프론트엔드까지, 아이디어를 실제로 동작하는 서비스로 만드는 풀스택 개발자입니다.",

  about: [
    "백엔드 설계와 프롬프트 엔지니어링을 결합해 AI 기능이 들어간 서비스를 끝까지 만들어내는 것을 좋아합니다.",
    "안정적인 API, 읽기 쉬운 코드, 그리고 사용자가 체감할 수 있는 결과물을 중요하게 생각합니다.",
  ],
  facts: [
    { label: "학교", value: "삼육보건대학교" },
    { label: "포지션", value: "Full-Stack / Backend" },
    { label: "관심사", value: "LLM · Prompt Engineering · API 설계" },
  ],

  skills: [
    { group: "Backend", icon: "⚙️", items: ["Node.js", "Express", "Python", "FastAPI", "REST API", "JWT Auth"] },
    { group: "Prompt / AI", icon: "🧠", items: ["Prompt Engineering", "LLM API", "RAG", "Function Calling", "Embeddings"] },
    { group: "Frontend", icon: "🎨", items: ["HTML", "CSS", "JavaScript", "React", "Responsive UI"] },
    { group: "Data & DevOps", icon: "🗄️", items: ["MySQL", "PostgreSQL", "MongoDB", "Docker", "Git", "Linux"] },
  ],

  // category: 필터 버튼과 연결됩니다.
  projects: [
    {
      title: "AI 상담 챗봇 API",
      category: "AI",
      desc: "역할·맥락을 분리한 프롬프트 템플릿과 대화 기록 관리로 일관된 응답을 주는 상담 챗봇 백엔드.",
      stack: ["Node.js", "LLM API", "PostgreSQL"],
      github: "#",
      demo: "#",
    },
    {
      title: "문서 검색 RAG 서비스",
      category: "AI",
      desc: "PDF 문서를 임베딩해 벡터 검색 후 근거와 함께 답변을 생성하는 질의응답 서비스.",
      stack: ["Python", "FastAPI", "Embeddings"],
      github: "#",
      demo: "",
    },
    {
      title: "커뮤니티 REST API",
      category: "Backend",
      desc: "JWT 인증, 게시글·댓글 CRUD, 페이지네이션과 권한 처리를 갖춘 커뮤니티 백엔드.",
      stack: ["Express", "MySQL", "JWT"],
      github: "#",
      demo: "",
    },
    {
      title: "개인 프로필 사이트",
      category: "Frontend",
      desc: "라이브러리 없이 바닐라 JS로 만든 반응형 프로필 사이트. 다크 모드와 스크롤 애니메이션 지원.",
      stack: ["HTML", "CSS", "Vanilla JS"],
      github: "#",
      demo: "#",
    },
  ],

  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "Blog", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],

  // 히어로 터미널에 출력될 내용 (prompt → response)
  terminal: [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "sungju — full-stack developer" },
    { type: "cmd", text: "cat stack.json" },
    { type: "out", text: '{ "backend": "Node / Python",\n  "ai": "Prompt Engineering",\n  "db": "SQL / NoSQL" }' },
    { type: "cmd", text: 'ask "무엇을 만들고 싶나요?"' },
    { type: "out", text: "> 사람에게 실제로 도움이 되는 AI 서비스." },
  ],
};
