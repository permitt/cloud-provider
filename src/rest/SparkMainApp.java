package rest;

import beans.User;
import com.google.gson.Gson;
import spark.Session;

import java.io.File;
import java.io.IOException;

import static spark.Spark.*;

public class SparkMainApp {

    private static Gson gson = new Gson();

    public static void main(String[] args) throws IOException {
        port(8080);
        staticFiles.externalLocation(new File("./static").getCanonicalPath());

        // Should redirect when not logged in
        get("/",(req,res)->{
            return "HomePage";
        });

        // Cisto da se ima
        get("/rest/demo/logout", (req, res) -> {
            res.type("application/json");
            Session ss = req.session(true);
            User user = ss.attribute("user");

            if (user != null) {
                ss.invalidate();
            }
            return true;
        });
    }
}
