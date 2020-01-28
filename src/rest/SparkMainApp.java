package rest;

import beans.BazaPodataka;
import beans.*;
import beans.Disk;
import beans.Korisnik;
import com.google.gson.Gson;
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
        Korisnik superAdmin = new Korisnik("super","super","Super","Admin",null,"superadmin");
       
       
        bp.dodajKorisnika(superAdmin);
        ArrayList<Korisnik> kor = new ArrayList<Korisnik>();
        VM vm = new VM();
        VM vmm = new VM();
        ArrayList<VM> resu = new ArrayList<VM>();
        resu.add(vmm);
        resu.add(vm);
        Organizacija o = new Organizacija("ORG1", "lalala","logo1", kor, resu);
        KategorijaVM kat = new KategorijaVM("KAT1",5,8,3);
        ArrayList<Disk> diskovi = new ArrayList<Disk>();
        VM vm1 = new VM("VM1",kat,diskovi,o);
        VM vm2 = new VM("VM2",kat,diskovi,o);
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

        get("/rest/vm/getVMs",(req,res) ->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            String uloga = k.getUloga();
            System.out.println(uloga);
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
    }
}