# ๐**Backend**

Typescript+Mongoose๋ก ๋ง๋ค์ด๋ณด๋ ์ผํ๋ชฐ ํ์ด์ง(ํฌ๋ชฝ ์ฐธ๊ณ )

๊ฒ์ํ API, ๊ฒฐ์   API(BootPay), ๋ก๊ทธ์ธ API, Heroku, Mongodb

## ๐**Getting Started**

- ์คํ

```bash
npm start
```

- ํฐ๋ฏธ๋ ํ๋ฉด

```bash
start5000
(node:18864) DeprecationWarning: Listening to events on the Db class has been deprecated and will be removed in the next major version.
connected
```

๋ก๊ทธ ์ค๋ช
start{port} โ localhost์ ์ฐ๊ฒฐ๋จ
listen์ด๋ผ๋ ์ฝ๋๋ฅผ ์ฐ๋ ๊ฒ์ ์ถ์ฒ ์ํจ โ ์๋ฌ ์๋๋ ๊ฑฑ์  No! โ ๋ฌด์
mongoose์ฐ๊ฒฐ๋์๋ค๋ ์๋ฏธ

- [localhost](http://localhost)์์ ์คํ ๊ฒฐ๊ณผ๋ฅผ ํ์ธ ํด๋ณด๊ณ  ์ถ๋ค๋ฉด ์คํ ํ

    [localhost](http://localhost:5000/):5000 ์ผ๋ก ์ ์

---

## ๐Build

- ์์ ์ ์ฝ๋๋ฅผ ์ ๊ณ  ๋์ ๋ฐฐํฌ๋ฅผ ์ํ .ts build **ํ์!** (tsโ js ๋ก ๋ณํ๋์ด /build ํด๋์ ๋ค์ด๊ฐ)

```bash
tsc 
```

- ์๋ฌด๋ฐ ๊ฒฐ๊ณผ ๋ก๊ทธ๊ฐ ์๋จ๋ ๊ฒ์ด ๋ง์ต๋๋ค. โ buildํด๋๋ฅผ ํ์ธํด์ฃผ์ธ์!
- ์ฃผ๊ธฐ์ ์ผ๋ก buildํด์ค์๋ค!

---

## ๐Heroku

Github ์์ฒด์ ์ฐ๋ ํ๊ธฐ ๋๋ฌธ์ ๋ฐ๋ก ๊น์ ์ด์ด์ ํ์ง ์์๋ ๋ฉ๋๋ค. main์ pushํ๋ฉด ๋ฐ๋ก ์๋ฒ์  ์ฌ๋ผ๊ฐ๋๋ค.
**์๋ฒ(main)์ ์ฌ๋ฆฌ์๊ธฐ ์ ์ branch์ค์ ์ ํ์๊ฑฐ๋ ํ ์ ํ ์ฌ๋ ค์ฃผ์๊ธธ ๋ฐ๋๋๋ค!** (์๋ฌ๋๋ฉด.. ๐)

1. vjsel ํ๋ก์ ํธ๋ก ๋ค์ด๊ฐ๊ธฐ
2. Deploy ๋ฉ๋ด ์ ํ
3. Deployment method โ **Github ์ ํ**
4. ๋งจ์๋ Manual deploy โ DeployBranch ํด๋ฆญ
    - ๋ธ๋ฐ์น๋ฅผ ๋๋ด์ ๊ฒฝ์ฐ ๋ธ๋ฐ์น ์ ํ
5. build ์ฑ๊ณต ์ view๋ฒํผ ํด๋ฆญ!
