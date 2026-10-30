# ADsP Note for Windows

Windows10/11 x64용 오프라인 ADsP 인터랙티브 학습 앱입니다.

## 사용

GitHub Releases에서 Windows ZIP을 받아 전체 압축을 해제하고 `ADsPNote.exe`를 실행합니다. EXE만 따로 옮기지 마세요. 브라우저나 별도 서버 설치 없이 실행하도록 패키징했습니다. 서명 없는 개인용 배포 파일입니다.

공개 배포본은 풀이 기록·별표·개념 진도가 비어 있습니다. 개인 JSON은 `내 학습 → JSON 가져오기`로 직접 불러옵니다. 새 기록은 이 PC의 `%APPDATA%\ADsPNote`에 저장하며 외부로 전송하지 않습니다. 기존 개인용 앱을 같은 Windows 계정에서 사용했다면 그 PC의 기존 기록을 이어갑니다.

## 기능

- 44~50회350문항, 회차·과목·랜덤 학습
- 즉시 채점·해설·오답노트·문제별 시간순 정오답 이력
- 학습 세트 목록 삭제와 복원(풀이 이력 유지)
- 별표·검색·개념62개·타이머·다크 모드·문제 PNG 저장
- JSON 백업·복원·이어서 학습

## 검증 한계

화면과 엔진·파일 저장 코드 검증을 수행했습니다. 빌드 환경이 Linux여서 Windows EXE 실기기 실행은 미검증입니다.

## 소스에서 빌드

Python3와 Node.js가 필요합니다.

```sh
python3 download_runtime.py
python3 build.py
node test_engine.cjs
python3 package_windows.py
```

`release/ADsP_Note_Windows`에 Windows 앱 폴더가 생성됩니다. 런타임은 Electron 공식 배포 파일을 고정 SHA256으로 검증합니다.

문제·해설의 출처는 문어CBT 기출 복원 자료이며 공식 시험 원문과 구별됩니다. 추가 개념 콘텐츠는 원문 해설과 구분됩니다. 이 저장소의 공개가 제3자 문제 자료의 별도 재배포 권한을 부여하는 것은 아닙니다.
