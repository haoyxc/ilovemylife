import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/* writes ordered (best to worst) recommendations: node recommendation1,recommendation2...
 * Receives (node, rec1,value1,rec2,value2...) -- recommendation scores
 * and (node EXISTING;node2) -- existing nodes to ignore
 */
public class FinishReducer extends Reducer<Text,Text,Text,Text> 
{
	//Ranking object that contains node name and rankvalue
	private class Ranking implements Comparable {
		private String id;
		private double value;
		
		Ranking(String id, double value) {
			this.id=id;
			this.value = value;
		}
		
		public String getId() {
			return id;
		}

		@Override
		public int compareTo(Object arg0) {
			if (arg0 instanceof Ranking) {
				return (int)Math.round(1000000*(((Ranking) arg0).value - this.value ));
			}
			else
				return 0;
		}

		public double getValue() {
			// TODO Auto-generated method stub
			return value;
		}
	}
	
	//sort and concatenate recommended friends
	public String getSortedRecommendations(String ranksString,HashSet<String> existing){
		ArrayList<Ranking> ranks = new ArrayList<Ranking>();
		StringBuffer sb = new StringBuffer();
		String[] els = ranksString.split(",");

		if (els.length<2)
			return "";

		for (int i=0; i<els.length; i++){
			String label = els[i].substring(0, labelWeight.indexOf("-"));
            String weight = els[i].substring(labelWeight.indexOf("-")+1);
			ranks.add(new Ranking(label, -1 * Double.parseDouble(weight)));
		}
		
		Collections.sort(ranks);
		
		for (Ranking rank : ranks){
			if (!existing.contains(rank.getId())) {//only include if not in existing friends
				//System.out.println(rank.getValue());
				sb.append(rank.getId());
				sb.append(",");
			}
		}

		if (sb.length()>0)
			sb.deleteCharAt(sb.length()-1);//remove extra comma;
	
		return sb.toString();
			
	}
	
	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException 
	{	
		ArrayList<String> rankValues = new ArrayList<String>();
		HashSet<String> existing = new HashSet<String>();//ignore self and existing friends

		existing.add(key.toString()); //add yourself to existing
	
		
		for (Text val : values){
			String[] valParts = val.toString().split(";");
			if (valParts[0].equals("EXISTING"))
					existing.add(valParts[1]);
			else{
				rankValues.add(valParts[0]);
			}
				
		}
		
		String outValue = "";
	

		if (rankValues.size()>1){
			outValue = "error";
		} else {
			outValue = getSortedRecommendations(rankValues.get(0), existing);
		}
		
		context.write(key, new Text(outValue));
	}
	
	
}