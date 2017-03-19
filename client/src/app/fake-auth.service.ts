export class FakeAuthService {
    private fake_toke = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6MCwidXNlcm5hbWUiOiJ0ZXN0MUB0ZXN0LmNvbSIsImlhdCI6MTQ4OTkyMDczOCwiZXhwIjoxNDkwMDA3MTM4LCJpc3MiOiJzb2NvYm8ifQ.E-KPZbZa9IV4ldaHpuYPzm6LPEtjyuRkRSXrbLF3RL0";

    public getToken () {
      return this.fake_toke;
    }
}