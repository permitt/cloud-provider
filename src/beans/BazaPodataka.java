package beans;

import java.util.HashMap;

public class BazaPodataka {
	private HashMap<String, Korisnik> korisnici;
	private HashMap<String, Organizacija> organizacije;
	private HashMap<String, VM> virtualeMasine;
	
	public BazaPodataka() {
		this.korisnici = new HashMap<String, Korisnik>();
		this.organizacije = new HashMap<String, Organizacija>();
		this.virtualeMasine = new HashMap<String, VM>();
	}
}
