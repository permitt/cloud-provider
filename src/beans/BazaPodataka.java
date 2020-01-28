package beans;

import java.util.ArrayList;
import java.util.Collection;
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
		this.kategorije = new HashMap<String, KategorijaVM>();
	} 
	
	public HashMap<String, Korisnik> getKorisnici() {
		return korisnici;
	}

	public void setKorisnici(HashMap<String, Korisnik> korisnici) {
		this.korisnici = korisnici;
	}

	public HashMap<String, Organizacija> getOrganizacije() {
		return organizacije;
	}

	public void setOrganizacije(HashMap<String, Organizacija> organizacije) {
		this.organizacije = organizacije;
	}

	public HashMap<String, VM> getVirtualneMasine() {
		return virtualneMasine;
	}

	public void setVirtualneMasine(HashMap<String, VM> virtualneMasine) {
		this.virtualneMasine = virtualneMasine;
	}

	public HashMap<String, Disk> getDiskovi() {
		return diskovi;
	}

	public void setDiskovi(HashMap<String, Disk> diskovi) {
		this.diskovi = diskovi;
	}

	public HashMap<String, KategorijaVM> getKategorije() {
		return kategorije;
	}

	public void setKategorije(HashMap<String, KategorijaVM> kategorije) {
		this.kategorije = kategorije;
	}

	public String getPutanja() {
		return putanja;
	}

	public void setPutanja(String putanja) {
		this.putanja = putanja;
	}



	public void dodajKategoriju(KategorijaVM k) {
		this.kategorije.put(k.getIme(), k);
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

	public void dodajVM(VM vm) {
		this.virtualneMasine.put(vm.getIme(), vm);
	}
	public HashMap<String, VM> dobaviListuVM(Korisnik k){
		//test
		if(k==null)
			return virtualneMasine;
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
	public String izmeniVM(VM novaVM,String staroIme) {
		if(unikatnoImeVM(novaVM.getIme())) {
			this.virtualneMasine.get(staroIme).setIme(novaVM.getIme());
			this.virtualneMasine.get(novaVM.getIme()).setKategorija(novaVM.getKategorija());
			return "OK";
		}
		else {
			return "EROR";
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

	public boolean dodajKorisnika(Korisnik k){
//		if(!this.organizacije.containsKey(k.getOrganizacija().getIme()))
//			return false;
//		Organizacija org = this.organizacije.get(k.getOrganizacija().getIme());

		korisnici.put(k.getEmail(),k);
		return true;
	}

	public boolean izmjeniKorisnika(String email,Korisnik k){
		Korisnik korisnik = this.nadjiKorisnika(email);
		korisnik.setIme(k.getIme());
		korisnik.setPrezime(k.getPrezime());
		korisnik.setPassword(k.getPassword());
		korisnik.setUloga(k.getUloga());
		return true;

	}

	public boolean izbrisiKorisnika(String email){
		if(!this.korisnici.containsKey(email))
			return false;
		Korisnik k = this.korisnici.get(email);
		k.getOrganizacija().getKorisnici().remove(k);
		this.korisnici.remove(email);
		return true;

	}

	public Collection<Korisnik> dobaviKorisnike(Korisnik k){
		// Znaci da je superadmin u pitanju, i vracamo sve korisnike tada
		if(k == null) {
			return this.korisnici.values();
		}
		// Ako nije superadmin, vracamo samo korisnike koji pripadaju istoj organizaciji kao admin
		return k.getOrganizacija().getKorisnici();

	}


}
