package rest;

import beans.BazaPodataka;
import beans.Disk;
import beans.Korisnik;
import com.google.gson.Gson;
import spark.Session;

import java.io.File;
import java.io.IOException;
import java.util.*;

import static spark.Spark.*;

public class SparkMainApp {

    private static Gson gson = new Gson();
    private static BazaPodataka bp = new BazaPodataka();


    public static void main(String[] args) throws IOException {
        port(8080);
        staticFiles.externalLocation(new File("./static").getCanonicalPath());

        Korisnik superAdmin = new Korisnik("superAdmin@superAdmin.com","superAdmin","Super","Admin",null,"superadmin");
        bp.dodajKorisnika(superAdmin);


        get("/",(req,res) ->{
            System.out.println("POGPODJEN");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            if(k == null)
                res.redirect("/login.html");

            return res;
        });

        // Should redirect when not logged in
        get("/rest/demo",(req,res)->{
            return "HomePage";
        });

        post("rest/login",(req,res) ->{

            String payload = req.body();
            Korisnik k = gson.fromJson(payload,Korisnik.class);

            return "OK";
        });


        // Cisto da se ima
        get("/rest/demo/logout", (req, res) -> {
            res.type("application/json");
            Session ss = req.session(true);
            //User user = ss.attribute("user");

//            if (user != null) {
//                ss.invalidate();
//            }
            return true;
        });
    }
}
