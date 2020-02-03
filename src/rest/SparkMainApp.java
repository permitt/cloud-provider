package rest;

import beans.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import data.BazaPodataka;
import spark.Session;
import spark.utils.IOUtils;

import java.io.*;
import java.text.ParseException;
import java.util.*;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import static spark.Spark.*;
import beans.VM;
public class SparkMainApp {

    private static Gson gson = new GsonBuilder().setDateFormat("EEE MMM dd yyyy HH:mm:ss").create();

    private static BazaPodataka bp = new BazaPodataka();


    public static void main(String[] args) throws IOException, ParseException {
        port(8080);
        staticFiles.externalLocation(new File("./static").getCanonicalPath());

        //bp.napuniBazu();
        ucitajBazu();

        //ORGANIZACIJE
        get("/rest/organizacije/all",(req,res) ->{
            res.type("application/json");
            return gson.toJson(bp.dobaviOrganizacije());

        });
       


        get("/rest/organizacije/all",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            res.type("application/json");
            if(ulogovan.getUloga().equals("superadmin")){
                return gson.toJson(bp.dobaviOrganizacije());
            }else if(ulogovan.getUloga().equals("admin")){
                return gson.toJson(ulogovan.getOrganizacija());
            }else{
                res.status(403);
                return res;
            }

        });

       
        get("/rest/organizacije/:ime",(req,res) ->{
            String param = req.params("ime");
            Organizacija o = bp.nadjiOrganizaciju(param);
          
            res.type("application/json");
            return gson.toJson(o);

        });


       
        post("/rest/organizacije",(req,res)->{
          
            String payload = req.body();
            Organizacija nova = gson.fromJson(payload,Organizacija.class);
            if(!bp.unikatnoImeOrg(nova.getIme())){
                res.status(400);
                return res;
            }

            bp.dodajOrganizaciju(nova);
            sacuvajBazu();
             return "OK";
         });
        post("/rest/organizacije/dodaj",(req,res)->{
        	req.attribute("org.eclipse.jetty.multipartConfig",new MultipartConfigElement("/temp"));
            Part filePart = req.raw().getPart("i_file");
            
            String imePart = req.queryParams("ime");
            String opisPart = req.queryParams("opis");
           
            try(InputStream is = filePart.getInputStream()){
            	OutputStream os = new FileOutputStream(
            			"././static/images/"+filePart.getSubmittedFileName());
            	IOUtils.copy(is, os);
            	os.close();
            }
            System.out.println(filePart.getSubmittedFileName());
            Organizacija org = new Organizacija();
            org.setIme(imePart);
            org.setOpis(opisPart);
            org.setLogo("images/"+filePart.getSubmittedFileName());
            
            
            if(!bp.unikatnoImeOrg(org.getIme())){
                res.status(400);
                return res;
            }

            bp.dodajOrganizaciju(org);
            sacuvajBazu();
            return "OK";
         });
        put("/rest/organizacije/:ime",(req,res)->{
        	req.attribute("org.eclipse.jetty.multipartConfig",new MultipartConfigElement("/temp"));
            Part filePart = req.raw().getPart("i_file");
            System.out.println(filePart.getSubmittedFileName());
            String imePart = req.queryParams("organizacija.ime");
            String opisPart = req.queryParams("organizacija.opis");
           
            try(InputStream is = filePart.getInputStream()){
            	OutputStream os = new FileOutputStream(
            			"././static/images/"+filePart.getSubmittedFileName());
            	IOUtils.copy(is, os);
            	os.close();
            }
            Organizacija org = new Organizacija();
            org.setIme(imePart);
            org.setOpis(opisPart);
            org.setLogo("images/"+filePart.getSubmittedFileName());
          
            String param = req.params("ime");
            if(org.getIme()!=null) {
            	if(!org.getIme().equals(param) && !bp.unikatnoImeOrg(org.getIme())){
            		res.status(400);
            		return res;
            	}
            }
            if(!bp.izmeniOrganizaciju(param,org)) {
            	
            	return "Failed";}
            sacuvajBazu();
            return "OK";
           
         });
        //KATEGORIJE
        get("/rest/kategorija/all",(req,res) ->{
            res.type("application/json");
            return gson.toJson(bp.dobaviKategorije());

        });
        put("/rest/kategorije/:ime",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("ime");
            String payload = req.body();
            KategorijaVM k = gson.fromJson(payload,KategorijaVM.class);
            if(!k.getIme().equals(param) && !bp.unikatnoImeKat(k.getIme())){
                res.status(400);
                return res;
            }
            if(!bp.izmeniKategoriju(param,k))
                return "Failed";
            sacuvajBazu();
            return "OK";
        });

        get("/rest/kategorije/:ime",(req,res)->{
            res.type("application/json");

            String param = req.params("ime");
            KategorijaVM k = bp.nadjiKategoriju(param);
            System.out.println(k.getIme());
            if(k == null){
                res.status(400);
                res.body("Kategorija s tim imenom ne postoji.");
                return res;
            }

            res.type("application/json");
            return gson.toJson(k);

        });
        post("/rest/kategorije",(req,res)->{
            String payload = req.body();
            System.out.println(payload);

            KategorijaVM nova = gson.fromJson(payload,KategorijaVM.class);
            if(!bp.unikatnoImeKat(nova.getIme())){
                res.status(400);
                return res;
            }
            bp.dodajKategoriju(nova);
            sacuvajBazu();
            return "OK";
        });
        delete("/rest/kategorije/:ime",(req,res) -> {
            String param = req.params("ime");
            //KategorijaVM k = bp.nadjiKategoriju(param);
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

    
            if(!ulogovan.getUloga().equals("superadmin")){
                res.status(403);
                return res;
            }

            if(!bp.obrisiKategoriju(param)) {
            	res.status(400);
                return "Failed!";
                }
            sacuvajBazu();
            return "OK";
        });
        
        
        
        
        
        
        get("/",(req,res) ->{

            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            if(k == null)
                res.redirect("/login.html");

            return res;
        });

        get("/rest/vm/all",(req,res) ->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            if(ulogovan == null){
                res.status(403);
                return res;
            }

            if(ulogovan.getUloga().equals("superadmin")) {
                return gson.toJson(bp.dobaviListuVM(null));
            }
            else {
                return gson.toJson(bp.dobaviListuVM(ulogovan));
            }
        });

        get("/rest/vm/:ime",(req,res) ->{
            res.type("application/json");
            String ime = req.params("ime");
            return gson.toJson(bp.getVirtualneMasine().get(ime));

        });
        
        post("/rest/vm",(req,res)->{
        	
            Session ss = req.session(true);
            
            Korisnik ulogovan = ss.attribute("korisnik");
            String org = ulogovan.getOrganizacija();
            
            
            String payload = req.body();
           
            System.out.println(payload);

            VM nova = gson.fromJson(payload,VM.class);
            
            if(ulogovan.getUloga().equals("admin")) {
            	 nova.setOrganizacija(org);
            }
           
            if(!bp.unikatnoImeVM(nova.getIme())){
                res.status(400);
                return res;
            }
            bp.dodajVM(nova);
            sacuvajBazu();
            return "OK";
        });
        put("/rest/vm/:ime",(req,res) -> {
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("ime");

            String payload = req.body();

            VM vm = gson.fromJson(payload,VM.class);

            //Provjera da li je prazno polje
            if(vm.getIme().equals("") || vm.getOrganizacija().equals("") || vm.getKategorija().getIme().equals("")){
                res.status(400);
                return res;
            }

            //Provjera da li je mijenjano ime i da li je unikatno
            if(!vm.getIme().equals(param) && !bp.unikatnoImeVM(vm.getIme())){
                res.status(400);
                return res;
            }



            // Admin  moze mijenjati samo iz svoje organizacije
            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(vm.getOrganizacija());

            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }


            if(!bp.izmjeniVM(param,vm))
                return "Failed";
            sacuvajBazu();
            return "OK";

        });

        get("/rest/vm/:ime/diskovi",(req,res)->{
            String param = req.params("ime");
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

            if(ulogovan.getUloga().equals("korisnik")){
                res.status(403);
                return res;
            }
            return gson.toJson(bp.getVirtualneMasine().get(param).getDiskovi());
        });

        delete("/rest/vm/:ime",(req,res)->{
            String param = req.params("ime");

            if(!bp.getVirtualneMasine().containsKey(param)){
                res.status(400);
                return res;
            }

            VM vm = bp.getVirtualneMasine().get(param);
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(vm.getOrganizacija());


            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }
;
            bp.obrisiVM(param);
            sacuvajBazu();
            return "OK";
        });

        get("/rest/kategorija/all",(req,res) ->{
            res.type("application/json");
            String param = req.params("ime");
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

            if(ulogovan.getUloga().equals("korisnik")){
                res.status(403);
                return res;
            }

            return gson.toJson(bp.getKategorije().values());

        });


        get("/rest/organizacija/all",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            res.type("application/json");
            if(ulogovan.getUloga().equals("superadmin")){
                return gson.toJson(bp.dobaviOrganizacije());
            }else if(ulogovan.getUloga().equals("admin")){
                return gson.toJson(bp.nadjiOrganizaciju(ulogovan.getOrganizacija()));
            }else{
                res.status(403);
                return res;
            }

        });

        post("rest/users/login",(req,res) ->{

            String payload = req.body();
            Session ss = req.session(true);
            HashMap<String, Object> mapa = gson.fromJson(payload, new TypeToken<HashMap<String, Object>>() {}.getType());
            String password = mapa.get("password").toString();

            if(!bp.getKorisnici().containsKey(mapa.get("email").toString())){
                return "Korisnik ne postoji.";
            }

            Korisnik k = bp.nadjiKorisnika(mapa.get("email").toString());
            if(k == null) {
                return "Korisnik ne postoji.";
            }else if(!k.getPassword().equals(password)){
                return "Pogresna kombinacija lozinke i imena.";
            }
            ss.attribute("korisnik",k);
            sacuvajBazu();
            return "OK";
        });


        post("/rest/users/logout", (req, res) -> {

            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");

            if (k != null) {
                ss.invalidate();
            }
            sacuvajBazu();
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
            if(k == null || k.getUloga().equals("korisnik")){
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
                res.body("Nije nadjen korisnik s tim mejlom.");
                return res;
            }

            res.type("application/json");
            if(ulogovan.getUloga().equals("admin") && k.getOrganizacija().equals(ulogovan.getOrganizacija())){
                return gson.toJson(k);
            }else if(ulogovan.getUloga().equals("superadmin")){
                return gson.toJson(k);
            }else{
                res.status(403);
                return res;
            }

        });

        put("/rest/users/:email",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("email");


            String payload = req.body();
            Korisnik k = gson.fromJson(payload,Korisnik.class);
            //Provjera da li je mijenjan mejl i da li je unikatan
            if(!k.getEmail().equals(param) && !bp.unikatanMejlKorisnika(k.getEmail())){
                res.status(400);
                return res;
            }

            // Admin  moze mijenjati samo iz svoje organizacije
            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(k.getOrganizacija());

            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }


            if(!bp.izmjeniKorisnika(param,k))
                return "Failed";
            //Ako je korisnik mijenjao svoj profil, moramo i azurirati sesiju
            if(ulogovan.getEmail().equals(param)) {
                ulogovan.setEmail(k.getEmail());
            }
            sacuvajBazu();
            return "OK";
        });


        post("/rest/users",(req,res)->{
           Session ss = req.session(true);
           Korisnik ulogovan = ss.attribute("korisnik");
           String payload = req.body();
           Korisnik novi = gson.fromJson(payload,Korisnik.class);
           if(!bp.unikatanMejlKorisnika(novi.getEmail())){
               res.status(400);
               return res;
           }

           bp.dodajKorisnika(novi);
            sacuvajBazu();
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
            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(k.getOrganizacija());


            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }

            if(!bp.izbrisiKorisnika(param))
                return "Failed!";
            sacuvajBazu();
            return "OK";
        });


        get("/rest/diskovi/all",(req,res)->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik k = ss.attribute("korisnik");
            if(k == null){
                res.status(403);
                return res;
            }
            if(k.getUloga().equals("superadmin"))
                return gson.toJson(bp.dobaviDiskove(null));

            return gson.toJson(bp.dobaviDiskove(k));
        });



        get("/rest/diskovi/:ime",(req,res)->{
            res.type("application/json");
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            if(ulogovan.getUloga().equals("korisnik")){
                res.status(403);
                return res;
            }
            String param = req.params("ime");
            Disk d = bp.nadjiDisk(param);
            if(d == null){
                res.status(400);
                res.body("Disk s tim imenom ne postoji.");
                return res;
            }

            res.type("application/json");
            return gson.toJson(d);

        });

        put("/rest/diskovi/:ime",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String param = req.params("ime");


            String payload = req.body();
            Disk d = gson.fromJson(payload,Disk.class);
            //Provjera da li je mijenjano ime i da li je unikatno
            if(!d.getIme().equals(param) && !bp.unikatnoImeDiska(d.getIme())){
                res.status(400);
                return res;
            }

            // Admin  moze mijenjati samo iz svoje organizacije
            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(d.getOrganizacija());

            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }


            if(!bp.izmjeniDisk(param,d))
                return "Failed";
            sacuvajBazu();
            return "OK";

        });

        delete("/rest/diskovi/:ime",(req,res) -> {
            String param = req.params("ime");
            Disk d = bp.nadjiDisk(param);
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");

            boolean priv = ulogovan.getUloga().equals("admin") && !ulogovan.getOrganizacija().equals(d.getOrganizacija());


            if(ulogovan.getUloga().equals("korisnik") || priv){
                res.status(403);
                return res;
            }

            if(!bp.izbrisiDisk(param))
                return "Failed!";
            sacuvajBazu();
            return "OK";
        });

        post("/rest/diskovi",(req,res)->{
            Session ss = req.session(true);
            Korisnik ulogovan = ss.attribute("korisnik");
            String payload = req.body();


            Disk novi = gson.fromJson(payload,Disk.class);
            if(!bp.unikatnoImeDiska(novi.getIme())){
                res.status(400);
                return res;
            }
            bp.dodajDisk(novi);
            sacuvajBazu();
            return "OK";
        });



    }
    public static void sacuvajBazu() throws IOException {
//        try (Writer writer = new FileWriter("bazaPodataka.json")) {
//            gson.toJson(bp, writer);
//            System.out.println("Uspjesno upisano u bazu.");
//        }
    };

    public static void ucitajBazu(){

        try(JsonReader reader = new JsonReader(new FileReader("bazaPodataka.json"))){
            //gson = new GsonBuilder().setDateFormat("MMM dd, yyyy, HH:mm:ss").create();
            bp = gson.fromJson(reader, BazaPodataka.class);
            gson = new GsonBuilder().setDateFormat("EEE MMM dd yyyy HH:mm:ss").create();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}