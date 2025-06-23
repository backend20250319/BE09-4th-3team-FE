# 🛠️ 프로젝트 사용 가이드

## 1. 레포지토리 클론

    git clone <레포지토리 URL>

## 2. 프로젝트 설치 및 실행

    cd <프로젝트 폴더>
    npm install     # Next.js 서버 실행을 위한 node_modules 설치
    npm run dev     # 개발 서버 실행

## 3. 브랜치 전략

- 브랜치는 **기능별로 나누지 않고**, 혼동을 줄이기 위해 **각자 이름 브랜치로 통일**합니다.
- `main` 브랜치에서 개인 브랜치를 생성한 후 작업을 진행해주세요.

| 이름   | 브랜치명 | 브랜치 생성 명령어         |
| ------ | -------- | -------------------------- |
| 임나연 | nayeon   | `git checkout -b nayeon`   |
| 조석근 | seokgeun | `git checkout -b seokgeun` |
| 박준범 | junbem   | `git checkout -b junbem`   |
| 이석진 | seokjin  | `git checkout -b seokjin`  |
| 지정호 | jungho   | `git checkout -b jungho`   |

> 🔁 브랜치 생성 명령어 실행 전 `main` 브랜치에서 시작했는지 꼭 확인하세요!
>
> ```bash
> git checkout main
> git pull origin main
> git checkout -b <브랜치명>
> ```

## 4. 작업 디렉토리

각자 이름으로 된 폴더 내에서 작업 진행

    📁 nayeon
    📁 seokgeun
    📁 junbem
    📁 seokjin
    📁 jungho

---

## 설치된 라이브러리

- Swiper (슬라이드 라이브러리)
- Axios (Http 통신 라이브러리)

## 📌 참고사항

- 현재 프로젝트는 **기본 틀만 구성된 상태**입니다.
- 메인 페이지, 헤더, 푸터 등은 아직 구현되지 않았습니다.
- 각자 담당 파트를 나누어 작업을 시작해주세요.
