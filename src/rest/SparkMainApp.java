package rest;

import beans.*;
import beans.Organizacija;

import com.google.gson.Gson;
import beans.Organizacija;
import com.google.gson.reflect.TypeToken;
import spark.Session;

import java.io.File;
import java.io.IOException;
import java.util.*;

import static spark.Spark.*;
import beans.VM;
public class SparkMainApp {

    private static Gson gson = new Gson();
    private static BazaPodataka bp = new BazaPodataka();


    public static void main(String[] args) throws IOException {
        port(8080);
        staticFiles.externalLocation(new File("./static").getCanonicalPath());
        //PROMENILA SAM
        Organizacija org = new Organizacija();
        Korisnik superAdmin = new Korisnik("super","super","Super","Admin",new Organizacija(),"superadmin");
        Korisnik pera = new Korisnik("pera@pera.com","pera","Petar","Peric",org,"admin");
        Korisnik djura = new Korisnik("djura@djura.com","djura","Djordje","Dokic",org,"korisnik");

        org.dodajKorisnika(pera);
        org.dodajKorisnika(djura);
        bp.dodajOrganizaciju(org);

        bp.dodajKorisnika(superAdmin);
        bp.dodajKorisnika(pera);
        bp.dodajKorisnika(djura);

        ArrayList<Korisnik> kor = new ArrayList<Korisnik>();

        VM vm = new VM();
        VM vmm = new VM();
        ArrayList<VM> resu = new ArrayList<VM>();
        resu.add(vmm);
        resu.add(vm);
        Organizacija o = new Organizacija("ORG1", "lalala","logo1", kor, resu);
        KategorijaVM kat1 = new KategorijaVM("KAT1",5,8,3);
        KategorijaVM kat2 = new KategorijaVM("KAT2",3,4,2);
        ArrayList<Disk> diskovi = new ArrayList<Disk>();
        VM vm1 = new VM("VM1",kat1,diskovi,o);
        VM vm2 = new VM("VM2",kat2,diskovi,o);
        bp.dodajVM(vm1);
        bp.dodajVM(vm2);


        get("/",(req,res) ->{
            System.out.println("POGPODJEN");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            if(k == null)
                res.redirect("/login.html");

            return res;
        });

        get("/rest/vm/all",(req,res) ->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            String uloga = k.getUloga();

            if(uloga.equals("superadmin")) {
                return gson.toJson(bp.dobaviListuVM(null));
            }
            else {
                return gson.toJson(bp.dobaviListuVM(k));
            }
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


        post("/rest/users/logout", (req, res) -> {

            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            System.out.println(k);
            if (k != null) {
                ss.invalidate();
            }
            return "OK";
        });

        // Svaka komponenta ce pozivati ovu funkciju nakon mounta, i cuvati u podacima trenutnog korisnika
        get("/rest/users/current",(req,res)->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            return gson.toJson(k);
        });

        get("/rest/users/all",(req,res) ->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            if(k == null){
                res.status(403);
                return res;
            }
            if(k.getUloga().equals("superadmin"))
                return gson.toJson(bp.dobaviKorisnike(null));

            return gson.toJson(bp.dobaviKorisnike(k));
        });

        get("/rest/users/:email",(req,res) ->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

            // Ako nema pristup, vratiti kod 403 Forbidden
            String param = req.params("email");
            Korisnik k = bp.nadjiKorisnika(param);
            if(k == null){
                res.status(400);
                res.body("User with that email was not found.");
                return res;
            }

            res.type("application/json");
            if(ulogovan.getUloga().equals("admin") && k.getOrganizacija().getIme().equals(ulogovan.getOrganizacija().getIme())){
                return gson.toJson(k);
            }else if(ulogovan.getUloga().equals("superadmin")){
                return gson.toJson(k);
            }else{
                res.status(403);
                return res;
            }

        });

        post("/rest/users/:email",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("email");

            String payload = req.body();
            Korisnik k = gson.fromJson(payload,Korisnik.class);

            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().getIme().equals(k.getOrganizacija().getIme());

            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }


            if(!bp.izmjeniKorisnika(param,k))
                return "Failed";

            return "OK";
        });

        delete("/rest/users/:email",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("email");
            Korisnik k = bp.nadjiKorisnika(param);

            if(ulogovan.getIme().equals(k.getIme())){
                res.status(400);
                return res;
            }
            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().getIme().equals(k.getOrganizacija().getIme());


            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }

            if(!bp.izbrisiKorisnika(param))
                return "Failed!";

            return "OK";
        });

    }


}