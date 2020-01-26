package beans;

import java.util.ArrayList;
import java.util.HashMap;

public class BazaPodataka {
	private HashMap<String, Korisnik> korisnici;
	private HashMap<String, Organizacija> organizacije;
	private HashMap<String, VM> virtualneMasine;
	private HashMap<String, Disk> diskovi;
	private HashMap<String, KategorijaVM> kategorije;
	private String putanja;

	public BazaPodataka() {
		this.korisnici = new HashMap<String, Korisnik>();
		this.organizacije = new HashMap<String, Organizacija>();
		this.virtualneMasine = new HashMap<String, VM>();
		this.diskovi = new HashMap<>();
	} 
	
	public String dodajOrganizaciju(Organizacija o) {
		if(nadjiOrganizaciju(o.getIme())==null) {
			this.organizacije.put(o.getIme(), o);
			return "OK";
		}
		else {
			return "EROR";
		}
		
	}
	//treba napraviti ====> dodajKorisnika, dodajVM, dodajDisk 
	
	public Organizacija nadjiOrganizaciju(String ime) {
		if (this.organizacije.containsKey(ime)) {
			return this.organizacije.get(ime);
		}
		else
			return null;
	}
	
	
	public String izmeniOrganizaciju(String ime,String opis,String logo) {
		String poruka = "Uspesna izmena!";
		Organizacija o = this.nadjiOrganizaciju(ime);
		if(o!=null) {
			poruka = "Organizacija sa imenom " + ime + " vec postoji!";
			return poruka;
		}
		else {
			o.setIme(ime); 
			o.setLogo(logo);
			o.setOpis(opis);
		}
		return poruka;
	}
	 public String obrisiKategoriju(String ime) {
		 if(postojiVMOveKategorije(ime)) {
			 return "EROR";
		 }
		 else{
			 this.kategorije.remove(ime);
			 return "OK";
		 }
		 
	 }
	private boolean postojiVMOveKategorije(String ime) {
		boolean postoji = false;
		for(VM vm : this.virtualneMasine.values()) {
			if(vm.getKategorija().getIme().equals(ime)) {
				postoji = true;
				break;
			}
		}
		return postoji;
	}

	public String izmeniKategoriju(String staroIme,String novoIme, int brojJezgara, int RAM, int GPU) {
		if(this.kategorije.containsKey(novoIme)) {
			return "Ime vec postoji";
		}
		else if(brojJezgara < 0) {
			return "Broj jezgara mora biti veci od 0";
		}
		else if(RAM < 0) {
			return "RAM mora biti veci od 0";
		}
		else if(GPU < 0) {
			return "GPU mora biti veci od 0";
		}
		else {
			this.kategorije.get(staroIme).setIme(novoIme);
			this.kategorije.get(staroIme).setBrojJezgara(brojJezgara);
			this.kategorije.get(staroIme).setGPU(GPU);
			this.kategorije.get(staroIme).setRAM(RAM);
			return "OK";
		}
	}
	public String dodajKategoriju(String ime,KategorijaVM k) {
		if(!this.kategorije.containsKey(ime)) {
			this.kategorije.put(ime, k);
			return "OK";
		}
		else {
			return "GRESKA";
		}
	}
	
	public HashMap<String, VM> dobaviListuVM(Korisnik k){
		//vraca listu vMasina organizacije kojoj korisnik pripada ili ciji je admin
		HashMap<String, VM> vMasine = new HashMap<String, VM>();
		Organizacija org = k.getOrganizacija();
		for(VM vm : org.getResursi()) {
			vMasine.put(vm.getIme(), vm);
		}
		return vMasine;
	}
	public boolean unikatnoImeVM(String ime) {
		if(this.virtualneMasine.containsKey(ime)) 
			return false;
		return true;
	}
	
	public String dodajVM(String ime, KategorijaVM kategorija, ArrayList<Disk> diskovi, String imeOrganizacije) {
		//ne znam jos kako da proveravam parametre, kako da vracam sta nije dobro
		//treba razmisliti malo o tome
		VM vm ;
		if(unikatnoImeVM(ime)) {
			vm = new VM(ime,kategorija,diskovi,this.organizacije.get(imeOrganizacije));
			return "OK";
		}
		else {
			return "Ime VM nije unikatno.";
			}
		
	}
	public void obrisiVM(String ime) {
		//otkaciti diskove koji su povezani sa VM koja se brise
		for(Disk d : this.diskovi.values()) {
			if(d.getVm().getIme().equals(ime)) {
				d.setVm(null);
			}
		}
		//obrisi VM
		this.virtualneMasine.remove(ime);
		}
	public String izmeniVM(String staroIme,String novoIme) {
		if(unikatnoImeVM(novoIme)) {
			this.virtualneMasine.get(staroIme).setIme(novoIme);
			return "OK";
		}
		else {
			return "Ime VM nije unikatno.";
		}
	}
	public void promeniListuAktivnostiVM(String imeVM) {
		
	}
	public void napuniBazu(){

	}

	public boolean unikatnoImeDiska(String ime){
		if(diskovi.containsKey(ime))
			return false;
		return true;
	}

	public Disk nadjiDisk(String ID){
		if(diskovi.containsKey(ID))
			return diskovi.get(ID);
		return null;
	}

	public void dodajDisk(String ime,String tip,int kapacitet,VM v){
		diskovi.put(ime,new Disk(ime,tip,kapacitet,v));
	}

	public boolean unikatanMejlKorisnika(String mejl){
		if(korisnici.containsKey(mejl))
			return false;
		return true;
	}

	public Korisnik nadjiKorisnika(String mejl){
		if(korisnici.containsKey(mejl))
			return korisnici.get(mejl);

		return null;
	}

	public void dodajKorisnika(Korisnik k){
		korisnici.put(k.getEmail(),k);
	}




}
