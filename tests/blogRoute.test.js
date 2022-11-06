const supertest = require("supertest")
const httpServer = require("../../server")


describe("blog Route", () => {

    it("GET /blog works", async () => {
        const response = await supertest(httpServer).get("/blogs")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
    })

    it("GET /blogs?id works", async () => {
        const response = await supertest(httpServer).get("/blogs?id=1")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
    })

    it("POST /blogs works", async () => {
        const response = await supertest(httpServer).post("/blogs").send(blogToAdd)
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(201)
        expect(response.body.title).toBe("New test blog")
        expect(response.body.author).toBe("Daniel")
        expect(response.body.year).toBe(2022)
    })

    it("DELETE /blogs works", async () => {
        const response = await supertest(httpServer).delete("/blogs?id=5")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Blog deleted")

        const response2 = await supertest(httpServer).get("/blogs")
        expect(response2.headers["content-type"]).toBe("application/json")
        expect(response2.status).toBe(200)
    })
});