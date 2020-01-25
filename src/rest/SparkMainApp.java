package rest;

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
    private static Map<String, Korisnik> korisnici = new HashMap<String, Korisnik>();

    public static void main(String[] args) throws IOException {
        port(8080);
        staticFiles.externalLocation(new File("./static").getCanonicalPath());


        Disk d = new Disk("aa","sda",12,"sd");
        Korisnik k = new Korisnik("a","b","aaa","ad",d,"SUPERADMIN");
        String objekat = gson.toJson(k);
        System.out.println(objekat);

        Scanner sc = new Scanner(System.in);
        System.out.println("Unesite username superadmina: ");
        String user = sc.next();
        System.out.println("Unesite password superadmina: ");
        String pw = sc.next();
        System.out.println("User superadmina : " + user + " a pw je : " + pw);
        // Should redirect when not logged in
        get("/rest/demo",(req,res)->{
            return "HomePage";
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
