package rest;

import beans.BazaPodataka;
import beans.Disk;
import beans.Korisnik;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
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


        post("rest/users/login",(req,res) ->{

            String payload = req.body();
            Session ss = req.session(true);
            HashMap<String, Object> mapa = gson.fromJson(payload, new TypeToken<HashMap<String, Object>>() {}.getType());
            String password = mapa.get("password").toString();
            Korisnik k = bp.nadjiKorisnika(mapa.get("email").toString());
            if(k == null) {
                return "User does not exist.";
            }else if(!k.getPassword().equals(password)){
                return "Wrong email/password combination.";
            }
            ss.attribute("korisnik",k);

            return "OK";
        });


        // Cisto da se ima
        get("/rest/users/logout", (req, res) -> {
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            System.out.println(k.toString());
            if (k != null) {
                ss.invalidate();
            }
            return true;
        });

        // Svaka komponenta ce pozivati ovu funkciju nakon mounta, i cuvati u podacima trenutnog korisnika
        get("/rest/users/current",(req,res)->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            return gson.toJson(k);
        });

    }
}