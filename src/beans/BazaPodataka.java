package beans;

import java.util.HashMap;

public class BazaPodataka {
	private HashMap<String, Korisnik> korisnici;
	private HashMap<String, Organizacija> organizacije;
	private HashMap<String, VM> virtualeMasine;
	private HashMap<String, Disk> diskovi;
	private String putanja;

	public BazaPodataka() {
		this.korisnici = new HashMap<String, Korisnik>();
		this.organizacije = new HashMap<String, Organizacija>();
		this.virtualeMasine = new HashMap<String, VM>();
		this.diskovi = new HashMap<>();
	} 
	
	public void dodajOrganizaciju(Organizacija o) {
		this.organizacije.put(o.getIme(), o);
	}
	public Organizacija nadjiOrganizaciju(String ime) {
		if (this.organizacije.containsKey(ime)) {
			return this.organizacije.get(ime);
		}
		else
			return null;
	}
	public String izmeniOrganizaciju(String ime,String opis,String logo) {
		String poruka = "";
		Organizacija o = this.nadjiOrganizaciju(ime);
		if(o!=null) {
			poruka = "Organizacija sa imenom " + ime + " vec postoji!";
		}
		else {
			o.setIme(ime);
			o.setLogo(logo);
			o.setOpis(opis);
		}
		return poruka;
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
